require('../models/database')
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');


/**
 * GET/
 * HomePage
 */

exports.homepage = async(req,res) => {
   try {
      const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);  
    const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
    const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
    const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);
    const spanish = await Recipe.find({ 'category': 'Spanish' }).limit(limitNumber);
    
    const food = { latest, thai, american, chinese, spanish };
    
    
    res.render('index', { title: 'Recipe Blog - Home', categories, food } );
  } catch (error) {
   res.status(500).send({message: error.message || "Error Occured" });
   }


}


/**
 * GET/Categories
 * Categories
 */

exports.exploreCategories = async(req, res) => {
   try {
     const limitNumber = 20;
     const categories = await Category.find({}).limit(limitNumber);
     res.render('categories', { title: 'Recipe Blog - Categoreis', categories } );
   } catch (error) {
     res.status(500).send({message: error.message || "Error Occured" });
   }
 } 


 /**
 * GET/Categories/ID
 * Categories
 */

 exports.exploreCategoriesById = async(req, res) => { 
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
    res.render('categories', { title: 'Recipe Blog - Categoreis', categoryById } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 



 /**
 * GET/recipe/:id
 * Recipe Page
 */

exports.exploreRecipe = async(req, res) => {
   try {
    
      let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);


    
     res.render('recipe', { title: 'Recipe Blog - Recipe', recipe } );
   } catch (error) {
     res.status(500).send({message: error.message || "Error Occured" });
   }
 } 


 /**
 * POST /search
 * Search 
*/
exports.searchRecipe = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
    res.render('search', { title: 'Recipe Blog - Search', recipe } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}


/**
 * GET/explorelatest
 * Latest
 */

exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render('explore-latest', { title: 'Recipe Blog - Explore-Latest', categories } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 

/**
 * GET /explore-random
 * Explore Random 
*/
exports.exploreRandom = async(req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render('explore-random', { title: 'Cooking Blog - Explore Latest', recipe } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 

/**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-recipe', { title: 'Recipe Blog - Submit Recipe', infoErrorsObj, infoSubmitObj   } );
}


/**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {
  
  try {
        
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files where uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }
     //Create New Recipe
      const newRecipe = new Recipe({
        name: req.body.name,
        description: req.body.description,
        email: req.body.email,
        ingredients: req.body.ingredients,
        category: req.body.category,
      image: newImageName
     
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.')
    res.redirect('/submit-recipe');
  } catch (error) {
     //res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}



//Edit recipe route
exports.editRecipeForm = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  let recipeId = req.params.id;
  const recipe = await Recipe.findById(recipeId);
  res.render('editRecipeForm', { title: 'Recipe Blog - Edit Recipe', infoErrorsObj, infoSubmitObj, recipe} );
}


//Update recipe route
exports.updateRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  let recipeId = req.params.id;
  const recipe = await Recipe.findByIdAndUpdate(recipeId, req.body, { new: true });
  res.redirect('/');
}





//Delete recipe route
exports.deleteRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  let recipeId = req.params.id;
  const recipe = await Recipe.findByIdAndDelete(recipeId, req.body, { new: true });
  res.redirect('/');
}














  



  




























