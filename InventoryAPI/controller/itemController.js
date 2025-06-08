import { itemSchem } from "../model/itemModel.js";
import { logSchema } from "../model/logModel.js";

export const addItem=async(req,res)=>{
    const {name,price,quantity,minQuantity}=req.body;

    try {
        if(!name || !price || !quantity || !minQuantity){
            return res.status(401).json({message:"All credentials required"});
        }
        const item= await itemSchem.create({
            name,
            price,
            quantity,
            minQuantity
        });
       return res.status(200).json(item);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export const updateItem=async(req,res)=>{
    const {id}= req.params
    try {
        const updateItem=await itemSchem.findByIdAndUpdate(id,req.body,{new:true});
        if(!updateItem){
            return res.status(401).json({message:"item id not Found"});
        }
        return res.status(200).json(updateItem);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }

}

// restock
export const restock=async(req,res)=>{
    const {quantity}=req.body;
    const {id}= req.params;
    try {
        const item=await itemSchem.findById(id);
        console.log(item);
        item.quantity+=quantity;
        await item.save();

        // const item= await itemSchem.findByIdAndUpdate(id,quantity,{new:true});


        await logSchema.create({
            itemId:item._id,
            operation:'restock',
            quantity
        });
        res.json(item);

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

// Sell
export const sellItem=async(req,res)=>{
    const {quantity}=req.body;
    const {id}=req.params;
    try {
        const item=await itemSchem.findById(id);
        if(item.quantity < quantity){
            return res.status(400).json({message:"Insufficent stock"});

        }
        item.quantity-=quantity;
        await item.save();

        await logSchema.create({
            itemId:item._id,
            operation:'sell',
            quantity
        });

        res.json(item);

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

// get logs

export const getLog = async (req, res) => {
  const logs = await logSchema.find({ itemId: req.params.id }).sort({ timestamp: -1 });
  res.json(logs);
};

// Low Stock ITems
export const lowStockItems=async(req,res)=>{
    const item= await itemSchem.find({$expr:{$lt:['$quantity','$minQuantity']}});
    res.json(item);
}

// Report Section
export const topSelling = async (req, res) => {
  const { start, end, limit } = req.query;

  const logs = await logSchema.aggregate([
    {
      $match: {
        operation: 'sell',
        timestamp: {
          $gte: new Date(start),
          $lte: new Date(end)
        }
      }
    },
    {
      $group: {
        _id: '$itemId',
        totalSold: { $sum: '$quantity' }
      }
    },
    {
      $lookup: {
        from: 'items',
        localField: '_id',
        foreignField: '_id',
        as: 'item'
      }
    },
    { $unwind: '$item' },
    {
      $project: {
        name: '$item.name',
        totalSold: 1
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: parseInt(limit) || 10 }
  ]);

  res.json(logs);
};


export const salesReport = async (req, res) => {
  const { start, end } = req.query;
  const logs = await logSchema.aggregate([
    { $match: { operation: 'sell', timestamp: { $gte: new Date(start), $lte: new Date(end) } } },
    {
      $group: {
        _id: '$itemId',
        totalQuantity: { $sum: '$quantity' }
      }
    },
    {
      $lookup: {
        from: 'items',
        localField: '_id',
        foreignField: '_id',
        as: 'item'
      }
    },
    { $unwind: '$item' },
    {
      $project: {
        name: '$item.name',
        totalQuantity: 1,
        revenue: { $multiply: ['$totalQuantity', '$item.price'] }
      }
    }
  ]);
  res.json(logs);
};