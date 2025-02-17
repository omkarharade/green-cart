// components/Navbar/NavbarContainer.js
'use client' // This component will be rendered on the client side

import { usePathname } from 'next/navigation';
import Navbar from './Navbar'; // Your Navbar component

const NavbarContainer = () => {
  const pathname = usePathname(); // Now we can use usePathname here

  return <>
    {pathname !== '/login' && pathname !== '/signup' && <Navbar pathname={pathname} />}
  </>
};

export default NavbarContainer;
