import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/apiResponse.js';

const registerUser = asyncHandler( async (req , res) => {
    //get user detail from frontend
    //validation - to check if field is not empty
    //check if user already exist or not: username , email
    //check for images , check for avatar
    //upload them to cloudinary
    //create user object - create entry in db
    //remove pass and refresh token field from response
    //check for user creation


    const {fullName , username , email , password} = req.body
    console.log("email: " , email);
    
    if(
        [fullName , email , username , password].some((field) =>
        field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{ username} , {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already existed")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is necessary")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar is necessary")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500 , "something went wring while registering user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})


export {
    registerUser,
}