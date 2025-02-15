"use client"

import React, { useEffect } from 'react'
import {useRouter } from "next/navigation";
import { useAuth } from '../../context/AuthContext';
import Admin from './admin/page';
import Customer from './customer/page';


function View() {
	const { userContext, tokenContext, refreshTokenContext } = useAuth();
    const router = useRouter();

    useEffect(() => {

        const userId = sessionStorage.getItem("userId")
        const isAdmin = JSON.parse(sessionStorage.getItem("isAdmin"));

        console.log("isAdmin ==== ", isAdmin)

        console.log("inside useEffect in view", " what is type of isAdmin", typeof isAdmin)

        if(isAdmin){
            router.push("/view/admin")
        }
        else{
            router.push("/view/customer")
        }
    },[])

	return <div> you are being redirected . . . . .</div>;
}

export default View;