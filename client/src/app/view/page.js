"use client"

import React, { useEffect, useState } from 'react'
import {useRouter } from "next/navigation";

function View() {

    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter(); 

    useEffect(() => {

        const userId = sessionStorage.getItem("userId")
        const storedAdmin =  sessionStorage.getItem("isAdmin");
        setIsAdmin(storedAdmin ? JSON.parse(storedAdmin) : false);
    },[])

    useEffect(() => {

        if(isAdmin){
            router.push("/view/admin")
        }
        else{
            router.push("/view/customer")
        }

    }, [isAdmin])

	return <div> you are being redirected . . . . .</div>;
}

export default View;