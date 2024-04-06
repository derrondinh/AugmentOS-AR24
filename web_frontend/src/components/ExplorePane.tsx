import { ActionIcon, Skeleton, Tooltip, Text } from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";
import { explorePaneUrlValue, selectedEntityValue } from "../recoil";
import { useRecoilValue } from "recoil";
import React, { useEffect, useState } from "react";

interface ExplorePaneProps {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExplorePane = ({ loading, setLoading}: ExplorePaneProps) => {

  const viewMoreUrl = useRecoilValue(explorePaneUrlValue);
  const selectedEntity = useRecoilValue(selectedEntityValue);
  //explorePaneUrlValue is what we send to 

  //Latent Lab Connection ------ Below

  const [inputValue, setInputValue] = useState('');
  const [sources, setSources] = useState<any[]>([]);
  // const iframeRef = useRef(null);

  const handleInputChange = (searchTerm: React.SetStateAction<string>) => {
    setInputValue(searchTerm);
  };

  // This useEffect hook runs handleUpdateSearch whenever inputValue changes
  // useEffect(() => {
  //   handleUpdateSearch();
  //   // if you have a dependency for handleUpdateSearch add it to the dependencies array
  // }, [inputValue]); // dependencies array


  // This useEffect hook runs handleUpdateSearch whenever inputValue changes
  useEffect(() => {
    if (selectedEntity === undefined) {
      return;
    }
    // console.log(selectedEntity.agent_name);
    console.log(selectedEntity.name);
    console.log(selectedEntity.summary);
    sendSearchToLatentLab(selectedEntity.name + " " + selectedEntity.summary);
    // if you have a dependency for handleUpdateSearch add it to the dependencies array
  }, [selectedEntity]); // dependencies array

  // parent
  // let sources = [];

  // useEffect(() => {
  //   handleInputChange(viewMoreUrl);

  // }, [viewMoreUrl]);

  window.addEventListener("message", (event) => {
    // console.log("Parent received connection from Latent Lab")
    // console.log(event)
    setSources([...sources, event.source])
  }, false);


  function sendSearchToLatentLab (latentLabQuery: string) {
    // console.log(sources.length)
    // console.log(sources)
    sources.forEach(source => {
      source.postMessage({searchTerm: latentLabQuery}, "http://localhost:3000/")
    })
  }

  const handleSubmit = () => {
    sources.forEach(source => {
      source.postMessage({submit: 1}, "http://localhost:3000/")
    })
  };

  //Latent Lab Connection ------ Above



  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <Skeleton
      visible={loading}
      h={"100%"}
      w={"100%"}
      sx={{ position: "relative" }}
    >
      <Tooltip label="Open page in browser">
        <ActionIcon
          component="a"
          href={viewMoreUrl}
          target="_blank"
          variant="light"
          color="indigo"
          size="xl"
          radius="xl"
          sx={{ position: "absolute", right: 0, bottom: 0 }}
        >
          <IconArrowUp style={{ width: "70%", height: "70%" }} stroke={1.5} />
        </ActionIcon>
      </Tooltip>
      {/* {viewMoreUrl === undefined ? (
        <Text m="auto" w="fit-content">
          Click on a card with a link to explore.
        </Text>
      ) : ( */}
        <iframe
          id="zoomed-in-iframe"
          // src={viewMoreUrl}
          src="http://localhost:3000/media-lab/"
          onLoad={handleLoad}
          width="100%"
          height="100%"
          frameBorder={0}
        ></iframe>
      {/* )} */}
    </Skeleton>
  );
};

export default ExplorePane;
