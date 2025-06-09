import mongoose from "mongoose";
import { book } from "../model/bookModel.js";
import { member } from "../model/member.js";
import { rental } from "../model/rental.js";

export const addBook=async(req,res)=>{
    const {title,author,category,quantity,rentalRate,minQuantity}=req.body;
    try {
        const addBook=await book.create({
            title,
            author,
            category,
            quantity,
            rentalRate,
            minQuantity
        });
        return res.status(200).json(addBook);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const updateBook=async(req,res)=>{
    const {id}=req.params;
    try {
        if(!id){
            return res.json({message:'Book not found'});
        }
        const updated=await book.findByIdAndUpdate(id,req.body,{new:true});
        res.status(200).json(updated)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const lowStock=async(req,res)=>{
    try {
       const stock=await book.find({$expr:{$lt:['$quantity','$minQuantity']}});
       res.json(stock);

    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

// Member controller

export const addMemeber=async(req,res)=>{
    const {name,email}=req.body
    try {
        const amember= await member.create({
            name,
            email
        });
        res.status(200).json(amember);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const updateMember=async(req,res)=>{
    const {id}=req.params;
    try {
        const updatedMeber= await member.findByIdAndUpdate(id,req.body,{new:true});
        res.status(200).json(updatedMeber)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const rentBook=async(req,res)=>{
    const {bookId,memberId,dueDate}=req.body;

    const books= await book.findById(bookId);
    if(!book || book.quantity < 1){
        return res.status(400).json({message:'Book unavailable'});
    }
    const rent= await rental.create({
       bookId,
       memberId,
       dueDate,
       status:'rented'
    });

    books.quantity-=1;
    await books.save();
    
    res.json(rent);
}

export const returnBook=async(req,res)=>{
    const {id}=req.params;
    try {
        const retru=await rental.findById(id);
        const books=await book.findById(retru.bookId)
        if(!retru || retru.status==='returned'){
            return res.status(400).json({message:'Invalid or already returned'});
        }
        const now=new Date();
        retru.returnDate=now;
        retru.status='returned';

        if(now > retru.dueDate){
            const daysLate=Math.ceil((now-retru.dueDate)/(1000*60*60*24));
            retru.fine=daysLate * books.rentalRate;
        }
        books.quantity+=1;
        await books.save();
        await retru.save();

        res.json({message:'Book returned',retru});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const fineSummary=async(req,res)=>{
    const {id}=req.params;
    try {
        const fine=await rental.aggregate([
            {$match:{
                memberId:new mongoose.Types.ObjectId(id)
            }},
            {$group:
                {_id:'$memberId',
                 TotalFine:{$sum:'$fine'},
                }
            },
            {$lookup:{
                from: 'members',
                localField: '_id',
                foreignField: '_id',
                as: 'member'
            }},
            {$unwind:'$member'},
            {$project:{
                name:'$member.name',
                email:'$member.email',
                TotalFine:1,

            }}
        ])
        if (fine.length === 0) {
            return res.status(404).json({ message: 'No rental records' });
            }

            res.json(fine[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const memberHistory=async(req,res)=>{
    const {id}= req.params;
    try {
        const history=await rental.aggregate([
            {$match:{
                memberId:new mongoose.Types.ObjectId(id)
            }},
            {$lookup:{
                from:'books',
                localField:'bookId',
                foreignField:'_id',
                as:'book'
            }},
            {
                $unwind:'$book'
            },
            {
                $project:{
                    title:'$book.title',
                    author:'$book.author',
                    rentalDate:1,
                    returnDate:1,
                    fine:1,
                    dueDate:1,
                    status:1
                }
            }

        ]);
        if (history.length === 0) {
            return res.status(404).json({ message: 'No records' });
            }

            res.json(history);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
}


export const topRented = async (req, res) => {
  const { start, end, limit } = req.query;

  try {
    const tops = await rental.aggregate([
        {
        $match: {
          status:'rented',
          rentalDate: {
            $gte: new Date(start),
            $lte: new Date(end)
          }
        }
      },
  {

    $group: {
      _id: '$bookId',
      totalRented: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: 'books',
      localField: '_id',
      foreignField: '_id',
      as: 'book'
    }
  },
  { $unwind: '$book' },
  {
    $project: {
      title: '$book.title',
      author: '$book.author',
      totalRented: 1
    }
  },
  { $sort: { totalRented: -1 } },
  { $limit: parseInt(limit)||10 }
]);


    res.json(tops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const overdueRentals = async (req, res) => {
  try {
    const today = new Date();

    const overdue = await rental.aggregate([
      {
        $match: {
          status: 'rented',
          dueDate: { $lt: today }
        }
      },
      {
        $lookup: {
          from: 'books',
          localField: 'bookId',
          foreignField: '_id',
          as: 'book'
        }
      },
      { $unwind: '$book' },
      {
        $lookup: {
          from: 'members',
          localField: 'memberId',
          foreignField: '_id',
          as: 'member'
        }
      },
      { $unwind: '$member' },
      {
        $project: {
          bookTitle: '$book.title',
          memberName: '$member.name',
          memberEmail: '$member.email',
          dueDate: 1,
          rentalDate: 1,
          status: 1
        }
      }
    ]);

    if (overdue.length === 0) {
      return res.status(404).json({ message: 'No overdue rentals' });
    }

    res.json(overdue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
