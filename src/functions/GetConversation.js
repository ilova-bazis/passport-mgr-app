

exports.getConversation = async (msg, person, specs)=>{

    console.log("Processing conversation");
    if(msg.result !==undefined){
        console.log("Returning conversation back");
        return {conversation: msg.result.conversation}
    }
    else {
        return {conversation: []}
    }
}