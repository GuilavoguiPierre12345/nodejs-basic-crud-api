class BaseController {
    constructor(_collection){
        this.collection = _collection;
    }

     getAllDocuments = async (req, res) => {
        await this.collection.find()
        .then((docs) => {
            return res.status(200).json({response : docs});
        })
        .catch((err) => {
            return res.status(500).json({error : err});
        });
    }

    getADocument = async (req, res) => {
        const _id = req.params.id;
        await this.collection.findById(_id)
        .then((docs) => {
            return res.status(200).json({response : docs});
        })
        .catch((err) => {
            return res.status(500).json({error : err});
        });
    }
    
    addDocument = async (req, res) => {
        const body = req.body;
        const docOccurence = await this.collection.find({name : body.name}).countDocuments();
        const findDocument = await this.collection.find({name : body.name});
        if (findDocument || docOccurence===0)
            return res.status(302).json({response : "duplicate error this document already exists"})
        await this.collection.create(body)
        .then((doc) => {
            return res.status(201).json({response : doc});
        })
        .catch((err) => {
            return res.status(500).json({response : err})
        })
    }

    updateDocument = async (req, res) => {
        const _id = req?.params?.id
        await this.collection.findByIdAndUpdate(_id, {
            name : req.body.name,
        })
        .then((docs) => {
            res.status(202).json({response : docs})
        })
        .catch((error) => {
            return res.status(500).json({response : error})
        })
    }

    deleteDocument = async (req, res) => {
        const _id = req?.params?.id;
        await this.collection.findByIdAndRemove(_id)
        .then((docs) => {
            return res.status(200).json({response : docs});
        })
        .catch((err) => {
            return res.status(500).json({error : err});
        });
    }
}

module.exports = {BaseController}