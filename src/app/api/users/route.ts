import { NextResponse } from "next/server";

const users=[
    {
        name:"ahmed"
    , age:18
    },
    {
        name:"mohamed"
    , age:20
    },
    {
        name:"khaild"
    , age:22
    }
]
export async function GET( ) {
    return NextResponse.json({
        message:"Success",
        data:{
            users
        }
    })
}

export async function POST(request:Request) {
   const body= await request.json()
   users.push(body)
    return NextResponse.json({
        message:"Success",
        data:{
            users
        }
    },{
        status:201
    })
}