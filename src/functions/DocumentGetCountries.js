

exports.docGetCountries = async (msg, person, specs)=>{

    console.log("Processing countries");
    if(msg.result !==undefined){
        console.log("Returning conversation back");
        return {countries: msg.result.countries}
    }
    else {
        return {countries: []}
    }
}