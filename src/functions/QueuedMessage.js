exports.queueProcessor = async (msg, person, specs )=> {

    if(msg.method === "system.queuedMessages"){
        console.log("Got a queued messages");
        return {}
    }
}