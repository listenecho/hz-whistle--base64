
import React from "react"
import { render } from "react-dom"
import DraggleLayout from '../../components/draggle-layout'
import styles from "./index.less";


const RigthContent = () => {
    return <div className={styles.rightContainer}></div>
}

const LeftContent = () => {
    return <div className={styles.leftContainer}></div>
}


const Result = () => {
    return <DraggleLayout
    containerWidth={"100%"}
    containerHeight={"100%"}
    min={50}
    max={500}
    initLeftWidth={100}
    handler={
      <div
        style={{
          width: 4,
          height: '100%',
          background: 'rgb(77, 81, 100)',
        }}
      />
    }
  >
   <RigthContent />
   <LeftContent />
  </DraggleLayout>
}
render( <Result /> , document.getElementById("root"))