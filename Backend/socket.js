import http from "http"
import express from "express"
import { Server } from "socket.io"
const app = express()
const server = http.createServer(app)

const io = new Server(server , {
    cors : {
        origin : "http://localhost:5173",
        methods : ["GET" ,"POST"]
    }
})

let useSocketMap = {}
export const getSockedId = (recieverId)=> {
    return useSocketMap[recieverId]
}
io.on("connection" , (socket)=> {
    const userId = socket.handshake.query.userId
    if(userId != undefined){
        useSocketMap[userId] = socket.id
    }


   io.emit("getOnlineUser" ,Object.keys(useSocketMap) ) 

    socket.on("disconnect" , ()=> {
        delete useSocketMap[userId]
        io.emit("getOnlineUser" , Object.keys(useSocketMap))
    })
})


export {app , io ,server}