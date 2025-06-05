import { prod } from "../model/products.js";

// GET Method
export const getAllProductsTesting= async (req,res)=>{
    const {company,name,featured,sort,select}=req.query;

    const queryObject={};

    if(company){
        queryObject.company=company;
    }
    if(featured){
        queryObject.featured=featured;
    }
    if(name){
        // queryObject.name=name;
        queryObject.name={$regex:name, $options:"i"};
    }

    let apiData = prod.find(queryObject);

    // Sorting
    if(sort){
        let sortfix=sort.replace(","," ");
        apiData= apiData.sort(sortfix);
    }

    // Select fields
    if(select){
        // let selectfix=select.replace(","," ");
        let selectfix=select.split(",").join(" ");
        apiData= apiData.select(selectfix);
    }

    // Pagination
    let page= Number(req.query.page)|| 1;
    let limit = Number (req.query.limit) || 3;
    let skip=(page-1)*limit;
    apiData=apiData.skip(skip).limit(limit);



    const myProducts= await apiData //sort for ascending and -1 for descending
    res.status(200).json({myProducts,total:myProducts.length,skip:skip});
};

export const getAllProducts= async (req,res)=>{
    const myProducts= await prod.find({});
    res.status(200).json({myProducts});
}

// POST MEthod

export const addProduct=async (req,res)=>{
    const product= req.body;
    console.log(product);
    const addProd= await prod.create(product);
    res.status(200).json(addProd);
}

// UPDATE (PUT) Method

export const updateProducts= async (req,res)=> {
    try {
         const {id}=req.params;
        const product= await prod.findByIdAndUpdate(id,req.body,{
        new: true,
        runValidators: true
      });

        if(!product){
            res.status(404).json({message:"product id not Found"});
        }

        const updatedProduct= await prod.findById(id);
        res.status(200).json(updatedProduct);
        console.log(updatedProduct);
    
        
    } catch (error) {
        res.status(500).json({message:error.message});
    }
   
}

// Delete Method

export const deleteProducts=async(req,res)=>{
    try {
         const {id}= req.params;
         const product= await prod.findByIdAndDelete(id);
         if(!product){
            res.status(404).json({message:"product id not Found"});
         }
         res.status(200).json({message:"Product deleted succssfully."});
        
    } catch (error) {
         res.status(500).json({message:error.message});
    }

}