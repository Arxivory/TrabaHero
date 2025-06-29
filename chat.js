const { createElement } = require("react");

class Guilds{
    constructor(name, time, message){
        this.name = name;
        this.time = time;
        this.message = message;
    }
}

(function(){
    const guildsArray = [
        new Guilds("NexaCloud Solutions", "10:42 AM", "Our DevOps team has pushed the latest security patch to production."),
        new Guilds("QuantumByte AI", "Yesterday, 3:15 PM", "Can you confirm the model version used for the last deployment?"),
        new Guilds("CircuitStream Labs", "Today, 9:58 AM", "The real-time analytics dashboard is now fully operational."),
        new Guilds("FusionStack Technologies", "Friday, 6:31 PM", "We’ve integrated the new API endpoint for billing queries."),
        new Guilds("VertexNet Security", "Monday, 11:02 AM", "All servers passed the vulnerability scan with no critical issues.")
    ];

    guildsArray.forEach((guils) =>{
        const guildChatBox = createElement("div");
        const guildPic = createElement("div");
        const guildMessage = createElement("p");
        const guildTime = createElement("p");
        const guildName = createElement("h3");
    })
})();