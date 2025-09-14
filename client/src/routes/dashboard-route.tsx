import React from "react";
import Container from "@/components/container";
import Header from "@/components/header";

const DashboardRoute = () => {
  return (
    <Container className={"flex flex-col min-h-screen"}>
      <Header />
      <div className={"flex-1 flex items-center justify-center"}>
        <h1>Welcome <span className={'font-bold'}>Yassine</span> to your account.</h1>
      </div>
    </Container>
  );
};

export default DashboardRoute;
