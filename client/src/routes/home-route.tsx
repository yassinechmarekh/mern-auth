import React from "react";
import Container from "@/components/container";
import Header from "@/components/header";

const HomeRoute = () => {
  return (
    <Container className={'flex flex-col min-h-screen'}>
      <Header />
      <div className={'flex-1 flex items-center justify-center'}>
        <h1>Home Page</h1>
      </div>
    </Container>
  );
};

export default HomeRoute;
