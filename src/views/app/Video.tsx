"use client";

import { useState } from "react";
import {
  Container,
  Text,
  Box,
  TextInput,
  Button,
  Group,
  Paper,
} from "@mantine/core";

const Video = () => {
  const [videoSource, setVideoSource] = useState<string>("");
  const [currentVideo, setCurrentVideo] = useState<string>("");

  const handlePlayVideo = () => {
    if (videoSource) {
      setCurrentVideo(videoSource);
    }
  };

  const preventContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <Container fluid mx={0}>
      <Text size="xl" fw={700} mb="lg">
        Video Player
      </Text>

      <Group mb="md">
        <TextInput
          placeholder="Enter video URL"
          value={videoSource}
          onChange={(e) => setVideoSource(e.target.value)}
          style={{ flexGrow: 1 }}
        />
        <Button onClick={handlePlayVideo}>Play</Button>
      </Group>

      <Paper withBorder p="md" radius="md">
        {currentVideo ? (
          <Box style={{ maxWidth: "100%" }}>
            <video
              controls
              width="100%"
              src={currentVideo}
              style={{ maxHeight: "70vh" }}
              controlsList="nodownload nofullscreen"
              disablePictureInPicture
              onContextMenu={preventContextMenu}
            >
              Your browser does not support the video tag.
            </video>
          </Box>
        ) : (
          <Text c="dimmed" ta="center" py="xl">
            Enter a video URL and click Play to start watching
          </Text>
        )}
      </Paper>
    </Container>
  );
};

export default Video;
