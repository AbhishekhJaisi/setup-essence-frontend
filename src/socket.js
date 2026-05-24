
import { io } from "socket.io-client";
import apiUrl from './config/api';


export const socket = io(`${apiUrl}`, {

  autoConnect: false,
  withCredentials: true
});

