import { loan } from "../model/loan.js";
import {user} from "../model/user.js";
import { equip } from "../model/equip.js";
import mongoose from "mongoose";

export const addEquip=async(req,res)=>{
    const {name,category,quantity,minstock,dailyFee}=req.body;
    try {
        const add=await equip.create({
            name,
            category,
            quantity,
            minstock,
            dailyFee
        });
        res.status(200).json(add);
        
    } catch (error) {
        console.log(error);
        return res.json({message:"Internal Server Error"});
    }
};

export const updateEquip=async(req,res)=>{
    const {id}=req.params;
    try {
        const updated=await equip.findByIdAndUpdate(id,req.body,{new:true});
        if(!updated){
            res.status(404).json({message:"item not found."})
        }
        res.json(updated)
    } catch (error) {
        console.log(error);
        return res.json({message:"Internal Server Error"});
    }
}

export const lowStock=async(req,res)=>{
    try {
        const low=await equip.find({
            $expr:{$lt:['$quantity','$minStock']}
        })
        res.json(low);
        
    } catch (error) {
        console.log(error);
        return res.json({message:"Internal Server Error"});
    }
}

// User Management

export const addUser=async(req,res)=>{
    const {name,email,role}=req.body;
    try {
        const add=await user.create({
            name,
            email,
            role
        });
        res.status(200).json(add)
    } catch (error) {
        console.log(error);
        return res.json({message:"Internal Server Error"});
    }
}

export const updateUser= async(req,res)=>{
    const {id}=id;
    try {
        const update=await user.findByIdAndUpdate(id,req.body,{new:true});
        if(!update){
            res.status(404).json({message:"User not Found"});
        }
        res.status(200).json(update);
    } catch (error) {
        console.log(error);
        return res.json({message:"Internal Server Error"});
    }
}

// Rental Management

export const rentEquip = async (req, res) => {
  try {
    const {equipId,userId,dueDate } = req.body;
    const userDoc = await user.findById(userId);
    console.log(userDoc)
    if (!userDoc) {
      return res.status(404).json({ message: "Invalid user" });
    }

    const equipDoc=await equip.findById(equipId);
    console.log(equipDoc);
    if (!equipDoc) {
      return res.status(404).json({ message: "Invalid equipment" });
    }

    if (equipDoc.quantity < 1) {
      return res.status(400).json({ message: "Insufficient quantity" });
    }

    const rent = await loan.create({
      equipId,
      userId,
      dueDate,
      status: 'rented'
    });

    equipDoc.quantity -= 1;
    await equipDoc.save();

    res.status(200).json(rent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const returnEquip=async(req,res)=>{
    try {
        const {id}=req.params;
        const rent=await loan.findById(id);
        const euiip=await equip.findById(rent.equipId);
        if(!rent && rent.status==='returned'){
            return res.status(404).json({message:"Not available or already returned"})
        };
        const now= new Date();
        rent.returnDate=now;
        rent.status='returned';
        if(rent.dueDate < now){
          const days=Math.ceil((now-rent.dueDate)/(1000*60*60*24));
           rent.fee=days * euiip.dailyFee;
        }
        euiip.quantity+=1
        await euiip.save();
        await rent.save();

         res.json(rent);

        
    } catch (error) {
        console.log(error);
        return res.json({message:"Internal Server Error"});
    }

}

export const getEquip=async(req,res)=>{
    const get=await equip.find();
    res.json(get);
}

// Report
export const overdue=async(req,res)=>{
    try {
        const today=new Date();
        const over=await loan.aggregate([
            {$match:{
                status:'rented',
                dueDate:{$lt:today}
            }},
            {$lookup:{
                from:'euips',
                localField:'_id',
                foreignField:'_id',
                as:'equip'
            }},
            {$unwind:'$equip'},
            {$lookup:{
                from:'users',
                localField:'_id',
                foreignField:'_id',
                as:'user'
            }},
            {$unwind:'$user'},
            {$project:{
                name:'$user.name',
                equip:'$equip.name',
                rentalDate:1,
                dueDate:1,
                fee:1,
                returnDate:1,
                status:1


            }}
            
        ]);
         if (over.length === 0) {
            return res.status(404).json({ message: 'No overdue rentals' });
            }

            res.json(over);
        
    } catch (error) {
        console.log(error);
        return res.json({message:"Internal Server Error"});
    }
}

export const topRented=async(req,res)=>{
    const {start,end,limit}=req.query;
    try {
        const trent=await loan.aggregate([
            {$match:{
                status:'rented',
                loanDate:{
                    $gte:new Date(start),
                    $lte:new Date(end)
                }

            }},
            {
             $group:{
                _id:'$equipId',
                TotalRented:{$sum:1},
                TotalFees:{$sum:'$fee'}
             }   
            },
            {
                $lookup:{
                    from:'euips',
                    localField:'_id',
                    foreignField:'_id',
                    as:'equip'
                }
            },
            {$unwind:'$equip'},
            {
                $project:{
                    name:'$equip.name',
                    TotalRented:1,
                    dailyFee:'$equip.dailyFee',
                    TotalFees:1
                }
            },
            { $sort: { totalRented: -1 } },
            { $limit: parseInt(limit)||10 }
        ]);
        res.json(trent);

    } catch (error) {
        console.log(error);
        return res.json({message:"Internal Server Error"});
    }

}

export const history=async(req,res)=>{
    const {id}=req.params;

    try {
        const his=await loan.aggregate([
            {$match:{
                userId:new mongoose.Types.ObjectId(id)
            }},
            {
                $lookup:{
                    from:'euips',
                    localField:'equipId',
                    foreignField:'_id',
                    as:'equip'
                }
            },
            {$unwind:'$equip'},
            {
                $project:{
                    name:'$equip.name',
                    loanDate:1,
                    returnDate:1,
                    fine:1,
                    dueDate:1,
                    status:1

                }
            }
        ])
        res.json(his)
    } catch (error) {
        console.log(error);
        return res.json({message:"Internal Server Error"});
    }

}