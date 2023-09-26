

const chalk = require("chalk");
const Expense = require('../model/expense')
const { isValidName, isValidInteger } = require('../validator/validation')
const mongoose = require('mongoose')

// ---------------------------------------------------------- Post Expence ----------------------------------------------------------------------

const postAddExpence = async (req, res, next) => {
    const session = await mongoose.startSession()
    
    try {
        const { itemName, expense, item, category } = req.body;
        if(!isValidName(itemName) ){
            console.log('firstName should include alphabet only');
            return res.status(400).send({success: false, msg: 'Item name should include alphabet only'})
        }
        if(!isValidInteger(expense) ){
            console.log('Expence should be Integer value');
            return res.status(400).send({success: false, msg: 'Item name should include alphabet only'}) 
        }
        if(!isValidName(item) ){
            console.log('Item should include alphabet only');
            return res.status(400).send({success: false, msg: 'Item name should include alphabet only'})
        }
        if(!isValidName(category) ){
            console.log('category should include alphabet only');
            return res.status(400).send({success: false, msg: 'category should include alphabet only'})
        }
        session.startTransaction()
        const data = await Expense.create({
            itemName,
            expense,
            item,
            category,
            userId: req.user

        })

        const totalexpense = Number(req.user.totalexpense) + Number(expense)
       // const updatedDoc = await User.findOneAndUpdate({_id:req.user._id},{$set:{totalexpense}},{new:true})
       req.user.totalexpense = totalexpense
       await req.user.save()
     
        res.status(201).json({ status: true, msg: "Tracker Successfully Created " })
        console.log(chalk.magenta(`Expense  -> itemName: ${itemName} - Expense: ${expense} - Item: ${item} - Category: ${category}`));
        await session.commitTransaction()
        session.endSession()
    }
    catch (err) {
        console.log(err.message)
        await session.abortTransaction()
        session.endSession()
        res.status(500).json({ Success: false, msg: "Server Error" })
    }
}

const getAllExpence=async(req,res,next)=>{
    const ITEMS_PER_PAGE = Number(req.query.ITEM_PER_PAGE)|| 2
    //console.log(req.user.id)
    let page= Number(req.query.page) ||1;
    try{
        const totalItems = await Expense.countDocuments({userId : req.user._id})
        const expense = await Expense.find({userId : req.user._id})
        .skip((page-1)*ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)

        res.status(200).json({
            expense,
            currentPage:page,
            hasNextPage:ITEMS_PER_PAGE*page < totalItems,
            nextPage:page+1,
            hasPreviousPage : page>1,
            previousPage: page-1,
            lastPage : Math.ceil(totalItems/ITEMS_PER_PAGE)
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'error occure data fetching time' });
    }
    
}

const deleteExpense = async function(req, res){
   
    try{
     
        const documentId = req.params.id;
       // console.log('new userid -->',userId);
        const getExpense = await Expense.findOne({_id : documentId})
       // console.log('getExpense.expense -->', getExpense.expense);
       await Expense.deleteOne({_id : documentId})

       const totalexpense = Number(req.user.totalexpense) - Number(getExpense.expense)
       // await User.findOneAndUpdate({_id:req.user._id},{$set:{totalexpense}},{new:true})
       req.user.totalexpense = totalexpense
       await req.user.save()
       console.log('Expence Successfully Deleted');
        res.status(200).json({ status: true, msg: "Expence Successfully Deleted" })
    
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: 'error occure data fetching time' });
    
    }
}

module.exports ={ postAddExpence, getAllExpence , deleteExpense };