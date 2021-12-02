import React from "react";
import styled from "styled-components";
import { PageHero } from "../components";
import aboutImg from "../assets/hero-bcg.jpg";
import { GiWrappedHeart } from "react-icons/gi";

const AboutPage = () => {
  return (
    <main>
      <PageHero title="about" />
      <Wrapper className="page section section-center">
        <img src={aboutImg} alt="Aboutthe mooon" />
        <article>
          <div className="title">
            <h2>our story</h2>
            <div className="underline"></div>
          </div>
          <p>
            Recently, not for the first time, there had been changes on
            copyright policies on content creating and sharing platforms. After
            the eventual purging of copyrighted content, creators on YouTube and
            Twitch platforms started receiving their content banned. Getting
            account bans and all out permanent account deletion on the
            platforms.
            <br />
            It is then, we had the idea to help content creators and leasers to
            create a platform which can be transparent and copyright abiding and
            automatic. Thus, this project was born. Join us in our way to the
            moon as we ride the Ethereum ! veniam aut soluta!
          </p>
        </article>
      </Wrapper>
    </main>
  );
};

const Wrapper = styled.section`
  display: grid;
  gap: 4rem;
  img {
    width: 100%;
    display: block;
    border-radius: var(--radius);
    height: 500px;
    object-fit: cover;
  }
  p {
    line-height: 2;
    max-width: 45em;
    margin: 0 auto;
    margin-top: 2rem;
    color: var(--clr-grey-5);
  }
  .title {
    text-align: left;
  }
  .underline {
    margin-left: 0;
  }
  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
`;
export default AboutPage;
