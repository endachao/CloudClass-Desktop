import React, { useState } from 'react'
import { Aside, Content, Layout } from 'agora-scenario-ui-kit'
import { WhiteboardContainer } from '../common-containers/board'
import { NavigationBar } from '../common-containers/nav'
import { VideoPlayerTeacher, VideoPlayerStudent } from '../common-containers/video-player'
import { RoomChat } from '../common-containers/chat'
import './small.style.css'

export const SmallClassRoom = () => {

  return (
    <Layout
      direction="col"
      style={{
        height: '100vh'
      }}
    >
      <NavigationBar />
      <Layout className="bg-white" style={{ height: '100%' }}>
        <Content>
          <WhiteboardContainer />
        </Content>
        <Aside>
          <VideoPlayerTeacher/>
          <RoomChat />
        </Aside>
      </Layout>
    </Layout>
  )  
}