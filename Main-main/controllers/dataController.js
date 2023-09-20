const axios = require('axios');
const path = require('path');
const dataBaseController = require('./dataBaseController');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const langDet = require('detectlanguage');
const dataController = {};
const azureKb = process.env.AA_AZURE_KB;
const azureKey = process.env.AA_AZURE_KEY;
const azureProject = process.env.AA_AZURE_PROJECT;
const langDetKey = process.env.AA_LAN_KEY;

async function processAnswers(answers) {
    let response = answers.answers.length > 1 ? 'Here are some answers I found:' : 'I found this answer:';
  
    const queryPromises = answers.answers.map(async (answer) => {
        const result = await new Promise((resolve, reject) => {
            dataBaseController.connection.query('SELECT * FROM answerpreviews WHERE q_id=? ORDER BY score DESC LIMIT 1', [answer.answer], (error, results) => {
                if (error) {
                    console.error('Error executing query:', error);
                    reject(error);
                } else {
                    resolve(results[0]['answer']);
                }
            });
        });
        return `<br><br>
                <a target="_blank" href="https://stackoverflow.com/q/${answer.answer}">${answer.questions[0]}</a>
                <br>
                <i>${result}</i>`;
    });
  
    const queryResults = await Promise.all(queryPromises);
    response += queryResults.join();
  
    return response;
}  

dataController.processQuery = async (req, res) => {
    // Validate input.
    if (req.body.input.trim().length === 0) {
        res.status(400).send(JSON.stringify({ message: 'Please ask a question.' }));
        return;
    }

    try {
        // Detect input language langDetKey.
        var detectlanguage = new langDet(langDetKey);
        var text = req.body.input;
        detectlanguage.detectCode(text).then(async function(result) {
        if(result !='en')
        {
         res.status(400).send(JSON.stringify({ message: `Sorry I don't speak '${result}', I can only speak English. ` }));
         return;
        }

        // Get top 3 answers from QnA API.
        const qnaResponse = await axios.post(`https://${azureKb}.cognitiveservices.azure.com/language/:query-knowledgebases`,
            {
                'top': 3,
                'question': req.body.input,
                'confidenceScoreThreshold': 0.5
            },
            {
                params: {
                    'projectName': azureProject,
                    'api-version': '2021-10-01',
                    'deploymentName': 'test'
                },
                headers: {
                    'Ocp-Apim-Subscription-Key': azureKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Inspect type of answer.
        const ans = qnaResponse.data.answers[0];
        if (ans.id === -1) { // No answers found.
            res.status(200).send(JSON.stringify({
                message: "Sorry, I don't have an answer for that."
            }));
        } else if (ans.source.includes('chitchat') || ans.source.includes('custom')) { // Conversational response.
            res.status(200).send(JSON.stringify({
                message: ans.answer
            }));
        } else { // StackOverflow answer.
            res.status(200).send(JSON.stringify({
                message: await processAnswers(qnaResponse.data)
            }));
        }});
        
    } catch (error) {
        console.error(error);
        res.status(500).send(JSON.stringify({ message: `Sorry, an error occurred on my end:\n${error}` }));
        return;
    }
}

module.exports = dataController;
