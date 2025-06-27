"use client";

import { useEffect, useState } from "react";

interface StoryContent {
  title: string;
  description: string;
}

export default function Page() {
  const [story, setStory] = useState<StoryContent | null>(null);

  useEffect(() => {
    fetch(
      "https://api.storyblok.com/v2/cdn/stories/home?version=draft&token=SySd6YFXHDQzNOBoSFcvrQt"
    )
      .then((res) => res.json())
      .then((data) => setStory(data.story.content))
      .catch(() => setStory(null));
  }, []);

  if (!story) return <div>Loading...</div>;

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Hello from Storyblok!</h1>
      <h2>{story.title}</h2>
      <p>{story.description}</p>
    </main>
  );
}
