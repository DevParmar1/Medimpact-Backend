const app = require("./app");
var cron = require("node-cron");

const PORT = process.env.PORT || 3001;

const {donorUpdate, medicineUpdate} = require("./Controllers/Subscription/SubscriberController")

cron.schedule('0 */6 * * *', async () => {
    medicineUpdate()
});

cron.schedule('0 */12 * * *', () => {
    donorUpdate()
});

app.listen(PORT,(req,res)=>{
    console.log(`Server started at port ${PORT}`)
})