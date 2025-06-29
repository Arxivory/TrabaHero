
class Guilds{
    constructor(name, time, message){
        this.name = name;
        this.time = time;
        this.message = message;
    }
}

(function(){
    const guildsArray = [
        new Guilds("NexaCloud Solutions", "10:42 AM", "Maria: Our DevOps team has pushed the latest security patch to production."),
        new Guilds("QuantumByte AI", "Yesterday, 3:15 PM", "Dray: Can you confirm the model version used for the last deployment?"),
        new Guilds("CircuitStream Labs", "Today, 9:58 AM", "Mark: The real-time analytics dashboard is now fully operational."),
        new Guilds("FusionStack Technologies", "Friday, 6:31 PM", "Jenny: We’ve integrated the new API endpoint for billing queries."),
        new Guilds("VertexNet Security", "Monday, 11:02 AM", "Amy: All servers passed the vulnerability scan with no critical issues.")
    ];

    guildsArray.forEach((guild) =>{
        const guildChatDetails = document.createElement("div");
        const guildChatBox = document.createElement("div");
        const guildPic = document.createElement("div");
        const guildMessage = document.createElement("p");
        const guildTime = document.createElement("p");
        const guildName = document.createElement("h3");
        const chatSidebar = document.querySelector(".contact-list");

        guildChatBox.style.display = "flex";
        guildChatBox.style.marginTop = "15px";

        guildPic.style.background = "linear-gradient(135deg, #ffeaa7, #fdcb6e)"
        guildPic.style.width = "50px";
        guildPic.style.height = "50px";
        guildPic.style.borderRadius = "30px";
        guildPic.style.marginRight = "5px";

        guildTime.style.fontSize = "13px";
        guildTime.style.color = "#e55a87";
 
        guildMessage.style.fontSize = "15px";
        guildMessage.style.whiteSpace = "nowrap";
        guildMessage.style.overflow = "hidden";
        guildMessage.style.textOverflow = "ellipsis";
        guildMessage.style.width = "15vw";
        guildMessage.style.color = "rgba(0, 0, 0, 0.54)";

        guildMessage.textContent = guild.message;
        guildTime.textContent = guild.time;
        guildName.textContent = guild.name;

        guildChatDetails.appendChild(guildName);
        guildChatDetails.appendChild(guildTime);
        guildChatDetails.appendChild(guildMessage);

        guildChatBox.appendChild(guildPic);
        guildChatBox.appendChild(guildChatDetails);
        
        chatSidebar.appendChild(guildChatBox);

    })
})();