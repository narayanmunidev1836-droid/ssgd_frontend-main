"use client";
import React, { useState, useEffect } from 'react';
import { FaArrowUp } from "react-icons/fa6";

const ScrollBottomToTopArrow = () => {
    const [isVisible, setIsVisible] = useState(false);


    const handleScroll = () => {
        const scrollTop = document.documentElement.scrollTop;
        setIsVisible(scrollTop > 100);
    }

    const scrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <div className={`scroll-to-top-arrow ${isVisible ? 'visible' : ''}`} onClick={scrollTop}>
                <FaArrowUp />
            </div>
        </>
    )
}
export default ScrollBottomToTopArrow;