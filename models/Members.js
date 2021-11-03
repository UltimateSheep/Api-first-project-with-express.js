const express = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Location: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Data = mongoose.model("Data", dataSchema);

module.exports = Data;