let express = require('express');
let router = express.Router();
let Storage = require('../models/storage');
let utils = require('../utils/utils');
let constants = require('../constants/constants');

/* GET storage listing. */
router.route('/')
    .get(function (req, res, next) {
        let queryData = req.query;
        let page = queryData['page'];
        let timeRange = queryData['timeRange'];
        let limit = constants.PAGE_SIZE;
        let skip = (page - 1) * limit;
        console.log(queryData);
        if (timeRange) {
            let startTime = new Date(timeRange[0]);
            let endTime = new Date(timeRange[1]);
        }
        let queryCondition = {};
        Storage.count(queryCondition, function (err, count) {
            Storage.find(queryCondition)
                .sort('-createInstance')
                .limit(limit)
                .skip(skip)
                .exec(function (err, storage) {
                    if (err) {
                        res.send({
                            success: false,
                            error: err
                        });
                    } else {
                        res.send({
                            success: true,
                            storage: storage,
                            page: {
                                total: count,
                                current: page
                            }
                        });
                    }
                });
        });
    })
    .post(function (req, res, next) {
        let storage = req.body;
        let newStorage = new Storage(Object.assign({}, storage, {createInstance: new Date()}));
        newStorage.save(function (err, storage) {
            if (err) {
                res.send({
                    success: false,
                    error: err
                });
            } else {
                res.send({
                    success: true,
                    storage: storage
                });
            }
        });
    });

router.route('/:storageId')
    .get(function (req, res, next) {
        let storageId = req.params.storageId;
        Storage.findById(storageId, function (err, storage) {
            if (err) {
                res.send({
                    success: false,
                    error: err
                });
            }
            res.send({
                success: true,
                storage: storage
            });
        })
    })
    .put(function (req, res, next) {
        let storageId = req.params.storageId;
        let storage = req.body;
        let newStorage = Object.assign({}, storage, {modifyInstance: new Date()});
        Storage.findOneAndUpdate({_id: storageId}, newStorage, {new: true}, function (err, storage) {
            if (err) {
                res.send({
                    success: false,
                    error: err
                });
            }
            res.send({
                success: true,
                storage: storage
            });
        });
    })
    .delete(function (req, res, next) {
        let storageId = req.params.storageId;
        Storage.remove({_id: storageId}, function (err) {
            if (err) {
                res.send({
                    success: false,
                    error: err
                });
            } else {
                res.send({
                    success: true
                });
            }
        });
    });

module.exports = router;
