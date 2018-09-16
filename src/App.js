import React from 'react';
import TopNav from "./TopNav";
import BottomNav from './BottomNav';
import RestForm from './RestForm';

export default class App extends React.Component {

  render() {
    return (
      <div style={{
        height: "100%",
        width: "100%",
        padding:"0",
        margin:"0",
        background:"lightblue",
        display:"flex",
        flex:1, 
        flexDirection:"column",
        justifyContent: "space-between",
        alignItems:"center"
      }}>
       <TopNav/>
       <RestForm />
       <BottomNav />
      </div>
    );
  }
}