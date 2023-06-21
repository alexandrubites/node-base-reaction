
const cors = require('cors')
const express = require('express')
const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['my-kafka-0.my-kafka-headless.alexandrubites.svc.cluster.local:9092']
});

const producer = kafka.producer()

const app = express();
app.use(cors());
app.options('*', cors());

const port = 8080;

app.get('/', (req, res, next) => {
  res.send('Reaction api - vladimir123');
});

const run = async (uId, oId, rId) => {

    await producer.connect()
//    await producer.send()
    await producer.send({
      topic: 'reactions',
      messages: [ 
	{ 
	  'value': `{ "userId": "${uId}",  "objectId": "${oId}", "reactionId": "${rId}"}` 
  	} 
      ],
    })
   await producer.disconnect()
}

app.get('/reaction', (req, res, next) => {
  const uId = req.query.userId;
  const oId = req.query.objectId;
  const rId = req.query.reactionId;
  
  res.send({'userId:': uId, 'objectID': oId,'reactionId' : rId } );
  run(uId, oId, rId).catch(e => console.error(`[example/producer] ${e.message}`, e))

});

app.listen(port,  () => 
	console.log('listening on port ' + port
));
