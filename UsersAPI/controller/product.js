import { ProductSchema } from "../model/Product.js";
export const addProduct=async(req,res)=>{
    const{title,description,category,img,quantity,price}=req.body;
    try{
    if(!title || !description || !category || !img ||!quantity ||!price){
        return res.status(401).json({error:"All fields are required"});

    }
    
    const productDetails= await ProductSchema.create({
        title,
        description,
        category,
        img,
        quantity,
        price
    });
      return res.status(200 ).json(productDetails);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }

}
// View Products
export const viewProducts=async (req,res)=>{
    try {
        const{title,category,price,sort,select}=req.query;
        const queryObject={};

        if(title){
            queryObject.title={$regex:title,$options:"i"};
        }
        if(category){
            queryObject.category=category;
        }
        if(price){
            queryObject.price=price;

        }

        let apiData=ProductSchema.find(queryObject);
        if(sort){
            let sortfix=sort.split(",").join(" ");
            apiData=apiData.sort(sortfix);

        }
        if(select){
            let selectfix=select.split(",").join(" ");
            apiData=apiData.select(selectfix);
        }

        // Pagination
        let page=Number(req.query.page)||1;
        let limit=Number(req.query.limit) || 3;
        let skip=(page-1)*limit;
        apiData=apiData.skip(skip).limit(limit);

        const products= await apiData;
        res.status(200).json({products,total:products.length,skip});

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

// GET Single Product

export const getProductById=async (req,res)=>{
    const {id}=req.params;
    try {
        if(!id){
            return res.status(401).json({message:"Id not found"});

        }
        const product= await ProductSchema.findById(id);
        res.status(200).json(product);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

// Update 

export const updateProduct=async(req,res)=>{
    const {id}=req.params;
    const updatedData=req.body;
    try {
        const update=await ProductSchema.findByIdAndUpdate(
            id,
            updatedData,
            {new:true});
        
        if(!update){
            return res.status(401).json({message:"Not Found"});
        }
        res.status(200).json({message:"Document Updated",update});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}

// Delete
export const deleteProduct=async(req,res)=>{
    const {id}=req.params;
    try {
        const deleted= await ProductSchema.findByIdAndDelete(id);
        if(!deleted){
            res.status(401).json({message:"if not found"});
        }
        res.status(200).json({message:"Product deleted successfully."})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}