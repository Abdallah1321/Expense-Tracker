const handleError = (err, res) => {

    err = err.toJSON()

    if (err.error.message.toString().includes("CastError")){
        res.status(err.statusCode).send({
            "statusCode": 400,
            "error": {
                "message": "Invalid ID [CE]"
            }        })
    } else if (err.error.message.toString().includes("DocumentNotFoundError")){
        res.status(err.statusCode).send({
            "statusCode": 404,
            "error": {
                "message": "Document not found ID [DNFE]"
            }        })
    } else {
        res.status(err.statusCode).send(err)
    }

}

module.exports = handleError