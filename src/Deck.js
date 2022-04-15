import {useState, useRef, useEffect} from 'react'
import axios from 'axios'
import Card from "./Card"
const API_BASE_URL = 'http://deckofcardsapi.com/api/deck'

const Deck = () => {
    const [deck, setDeck] = useState(null)
    const [drawn, setDrawn] = useState([])
    const [timer, setTimer] = useState(false)
    const timerId = useRef()
    useEffect (() => {
        async function getDeck () {
            const deckRes =  await axios.get(`${API_BASE_URL}/new/shuffle/?deck_count=1`)
           
            setDeck(deckRes.data)
        }
       getDeck()
    },[setDeck])

    

   
        const remaining = 52 - drawn.length
        // async function getCard () {
        //     try {
        //         if (remaining === 0){
        //             alert("Error: No cards remaining")
        //         }
        //         const cardRes =  await axios.get(`${API_BASE_URL}/${deck.deck_id}/draw/?count=1`)
        //         const card = (cardRes.data.cards[0])
        //         setDrawn(d => [
        //             ...d,
        //             {
        //                 id: card.code,
        //                 name: `${card.suit} ${card.value}`,
        //                 image: card.image
        //              }
        //         ])
        //     }catch (e) {

        //     }
          
        // }
        const switchTimer = () => {
            
            setTimer(timer => !timer);
            
        }
        useEffect (() => {
            async function getCard () {
                try {
                    if (remaining === 0){
                       alert("No cards remaining")
                    }
                    const cardRes =  await axios.get(`${API_BASE_URL}/${deck.deck_id}/draw/?count=1`)
                    const card = (cardRes.data.cards[0])
                    setDrawn(d => [
                        ...d,
                        {
                            id: card.code,
                            name: `${card.suit} ${card.value}`,
                            image: card.image
                         }
                    ])
                }catch (e) {
                    alert(e)
                }
              
            }
            if (timer && !timerId.current){
                timerId.current = setInterval(() => {
                    getCard()
            }, 1000);
            }
            

            return () => {
                clearInterval(timerId.current)
                timerId.current = null
            }
        },[switchTimer])

       

    const cards = drawn.map(c => <Card url={c.image} key={c.code}/>)
    // console.log(timer)

    return (
        
        <div>
            <button onClick={switchTimer}>{timer ? 'Stop Draw' : 'Start Draw'}</button>
            <div>{cards}</div>
        </div>
    )
}

export default Deck;