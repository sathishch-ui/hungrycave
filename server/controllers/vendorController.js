const Vendor = require('../models/Vendor')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const dotEnv = require('dotenv')
dotEnv.config()

const secretKey = process.env.WhatIsYourName

const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body
    try {
        const vendorEmail = await Vendor.findOne({ email })
        if (vendorEmail) {
            return res.status(400).json("Email Already Registered")
        } 
         const hashedPassword = await bcrypt.hash(password, 10)
            const newVendor = new Vendor({
                username,
                email,
                password: hashedPassword
            })
            await newVendor.save()
            console.log('Vendor Registered')
            return res.status(201).json({
                message: 'Vendor Registered Succefully'
            })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal Error"})
    }
}

const vendorLogin = async(req, res) => {
    const { email, password } = req.body
    try {
        const vendor = await Vendor.findOne({ email })
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.status(401).json({error: "Invalid Credentials"})
        }
        const token = jwt.sign({vendorId: vendor._id}, secretKey, {expiresIn: "1h"})
        res.status(200).json({ success: 'Login Successful', token})
        console.log(email, token)
    }
    catch (error) {
        console.log(error)
        res.status(500).json({error: "Internal Error"})
    }
}

const getAllVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm')
        res.status(200).json({vendors})
    }
    catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Error" });
  }
}

const getVendorById = async (req, res) => {
    const vendorId = req.params.id
    try {
        const vendor = await Vendor.findById(vendorId).populate('firm')
        if (!vendor) {
            res.status(404).json({error: 'Vendor Not Found'})
        }
        res.status(200).json(vendor)
    }catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Error" });
  }    
}

module.exports = {vendorRegister, vendorLogin, getAllVendors, getVendorById}