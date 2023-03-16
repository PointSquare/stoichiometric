/** @jsxImportSource theme-ui */
import { useContext, useEffect, useState } from "react";

import { ResponsiveContext } from 'contexts/ResponsiveContext';

import { NavLink } from "react-router-dom";

import { randomIntFromInterval, nFormatter } from "functions/maths";

import Button from "components/Button";
import Star from "components/Star";

import bitcoin from "../img/bitcoin.png";
import ethereum from "../img/ethereum.png";

function Home() {
    const { device, windowSize } = useContext( ResponsiveContext );

    const [stars, setStars] = useState(Array.from({length: 5}, (_, i) => [randomIntFromInterval(0,1), randomIntFromInterval(10,90), randomIntFromInterval(10,90), randomIntFromInterval(0,1)]));

    const style = {
        navlink: {
            zIndex: '1000'
        },

        top: {
            position: 'absolute' as 'absolute',
            left: '0',
            top: '0',
    
            padding: `0 ${device == "mobile" ? "20px" : "50px"}`,
            width: `calc(100% - ${device == "mobile" ? "40px" : "100px"})`,
            height: `${device == "mobile" ? "70px" : "100px"}`,
    
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
    
        beaker: {
            fontFamily: 'primary',
            fontSize: 5,
            color: 'text',
            fontWeight: '600',
    
            margin: '0',
            padding: '0'
        },
    
        fi: {
            fontFamily: 'primary',
            fontSize: 2,
            color: 'primary',
    
            margin: '0',
            padding: '0'
        },
    
        right: {
            display: 'flex',
            alignItems: 'center'
        },
    
        social: {
            height: '20px',
            aspectRatio: '1',
            background: 'text',
            zIndex: '1000',
            cursor: 'pointer',
            marginRight: '20px',
            '&:hover': {
                background: 'primary'
            },
            '&:nth-child(3)': {
                marginRight: '40px'
            }
        },
    
        telegram: {
            "-webkit-mask":"url('/social/telegram.svg') center/contain",
            mask:"url('/social/telegram.svg') center/contain",
        },
    
        twitter: {
            "-webkit-mask":"url('/social/twitter.svg') center/contain",
            mask:"url('/social/twitter.svg') center/contain",
        },
    
        discord: {
            "-webkit-mask":"url('/social/discord.svg') center/contain",
            mask:"url('/social/discord.svg') center/contain",
        },
    
        link: {
            color: 'text',
            marginRight: '40px',
            fontSize: 1,
            fontWeight: 500,
            opacity: .6,
            cursor: 'pointer',
            zIndex: '1000',
            '&:hover': {
                opacity: 1
            }
        },
    
        center: {
            width: 'calc(100% - 40px)',
            padding: "0 20px",
            left: '50%',
            marginTop: `${device == "mobile" ? "150px" : "200px"}`,
            display: 'flex',
            flexDirection: 'column' as 'column',
            alignItems: `${device == "mobile" ? "start" : "center"}`
        },
    
        catchphrase: {
            fontFamily: 'primary',
            fontSize: `${device == "mobile" ? 7 : 9}`,
            color: 'text',
            fontWeight: '600',
            textTransform: 'capitalize' as 'capitalize',
            width: `${device == "mobile" ? "80%" : "auto"}`,
    
            margin: '0',
            padding: '0'
        },
    
        subtitle: {
            fontFamily: 'primary',
            fontSize: `${device == "mobile" ? 2 : 10}`,
            width: `${device == "mobile" ? "70%" : "auto"}`,
            color: 'text',
            fontWeight: '300',
    
            margin: '0',
            padding: '0',
        },

        socialRow: {
            display: 'flex',
            alignItems: 'center',
            marginTop: '15px',
        },
    
        highlight: {
            color: 'primary'
        },
    
        bitcoin: {
            height: '150px',
            aspectRatio: '1',
            position: 'absolute' as 'absolute',
            right: '30%',
            bottom: '30%',
            zIndex: '-1',
            filter: 'grayscale(100%)',
            opacity: '.15',
            animation: 'oscilate 10s ease-in-out infinite'
        },
    
        ethereum: {
            height: '150px',
            aspectRatio: '1',
            position: 'absolute' as 'absolute',
            left: '20%',
            bottom: '50%',
            zIndex: '-1',
            filter: 'grayscale(100%)',
            opacity: '.15',
            animation: 'oscilate-mirror 15s ease-in-out infinite'
        },
    }

    return (
        <div>
            {stars.map(x => { return (
                <Star left={x[1].toString()} top={x[2].toString()} height={x[0] ? "15" : "20"} color={x[3] ? "text" : "text2"}/>
            )})}
            
            <div sx={style.top}>
                <h1 sx={style.beaker}>Stoichiometric<span sx={style.fi}>.beaker.fi</span></h1>
                <div sx={style.right}>
                    {device == "mobile" ? null : <div sx={{...style.social, ...style.telegram}} onClick={() => window.location.replace("https://t.me/BeakerFi")}/>}
                    {device == "mobile" ? null : <div sx={{...style.social, ...style.discord}} onClick={() => window.location.replace("https://discord.com/invite/8CwZkCA7Au")}/>}
                    {device == "mobile" ? null : <div sx={{...style.social, ...style.twitter}} onClick={() => window.location.replace("https://twitter.com/beaker_fi")}/>}
                    {device == "mobile" ? null : <p sx={style.link} onClick={() => window.location.replace("https://docs.beaker.fi")}>Docs</p>}
                    <NavLink sx={style.navlink} to="/swap">
                        <Button>Enter App</Button>
                    </NavLink>
                </div>
            </div>

            <div sx={style.center}>
                <h1 sx={style.catchphrase}>
                    Don't trust firms, trust <span sx={style.highlight}>debt.</span>
                </h1>
                <h3 sx={style.subtitle}>
                    Use our <span sx={style.highlight}>stablecoin</span> model to get rid of <span sx={style.highlight}>volatility</span>
                </h3>
                { device == "mobile" ?
                    <div sx={style.socialRow}>
                        <div sx={{...style.social, ...style.telegram}} onClick={() => window.location.replace("https://t.me/BeakerFi")}/>
                        <div sx={{...style.social, ...style.discord}} onClick={() => window.location.replace("https://discord.com/invite/8CwZkCA7Au")}/>
                        <div sx={{...style.social, ...style.twitter}} onClick={() => window.location.replace("https://twitter.com/beaker_fi")}/>
                    </div>
                    : 
                    null
                }
            </div>

            <img sx={style.bitcoin} src={bitcoin}/>
            <img sx={style.ethereum} src={ethereum}/>
        </div>
    )
}

export default Home;