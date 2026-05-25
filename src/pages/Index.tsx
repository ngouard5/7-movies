import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { EmojiCarousel } from "@/components/game/EmojiCarousel";
import { PlayButton } from "@/components/game/PlayButton";
import { HeaderLayout } from "@/components/layout/HeaderLayout";
import { AppLayout } from "@/components/layout/AppLayout";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  return (
    <>
      <Helmet>
        <title>movie.guessr - Find movie titles based on emojis as fast as you can!</title>
        <meta name="description" content="Guess movie titles from emoji clues as fast as you can! Challenge your friends and test your movie knowledge in this fun, addictive game." />
        <link rel="canonical" href="https://movie.guessr.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movie.guessr.app/" />
        <meta property="og:title" content="movie.guessr - Emoji Movie Guessing Game" />
        <meta property="og:description" content="Guess movie titles from emoji clues as fast as you can! Challenge your friends and test your movie knowledge in this fun, addictive game." />
        <meta property="og:image" content="https://movie.guessr.app/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="movie.guessr - Emoji Movie Guessing Game" />
        <meta name="twitter:description" content="Guess movie titles from emoji clues as fast as you can! Challenge your friends and test your movie knowledge in this fun, addictive game." />
        <meta name="twitter:image" content="https://movie.guessr.app/og-image.jpg" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "movie.guessr",
            "description": "Guess movie titles from emoji clues as fast as you can! Challenge your friends and test your movie knowledge in this fun, addictive game.",
            "url": "https://movie.guessr.app",
            "applicationCategory": "Game",
            "operatingSystem": "Web Browser",
            "author": { "@type": "Person", "name": "Nicolas Gouard" },
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "gamePlatform": "Web Browser",
            "genre": "Quiz Game"
          })}
        </script>
      </Helmet>
      <AppLayout>

        <HeaderLayout>
          <div className="relative flex-1">

            <div className="flex flex-col items-center space-y-8 px-4 pt-8 pb-8">
              <div className="text-[64px]" role="img" aria-label="Popcorn emoji">
                🍿
              </div>

              <h1 className="w-[90%] max-w-[400px] md:max-w-[640px] text-[56px] leading-[64px] text-center text-[#191919] max-sm:text-[40px] max-sm:leading-[48px] font-fredoka whitespace-pre-line">
                {t('find.movies')}
              </h1>
            </div>

            <div className="w-full">
              <EmojiCarousel />
            </div>

            <div className="flex flex-col items-center space-y-8 px-4 pt-8">
              <section className="w-[90%] max-w-[400px] md:max-w-[640px] text-[22px] leading-[30px] text-[#191919] text-center max-sm:text-lg max-sm:leading-[26px] font-sf">
                <p>
                  {t('game.description')}
                </p>
              </section>

              <div className="w-[90%] max-w-[400px] md:max-w-[560px]">
                <PlayButton />
              </div>

              <Link to="/how-to-play" className="text-xl font-bold text-[#191919] hover:text-[#E72F2F] transition-colors font-sf">
                {t('how.to.play')}
              </Link>
            </div>
          </div>

          <footer className="mt-12 pb-8 text-center text-[14px] text-gray-500 font-sf space-y-1 px-4">
            <p>movie.guessr is an after dinner project made with 🍿 by <a href="https://nicolasgouard.com" className="underline hover:text-[#E72F2F] transition-colors" target="_blank" rel="noopener">Nicolas Gouard</a></p>
            <p>If you have feedbacks please write to <a href="mailto:feedback@guessr.app" className="underline hover:text-[#E72F2F] transition-colors">feedback@guessr.app</a></p>
          </footer>
        </HeaderLayout>
      </AppLayout>
    </>
  );
};
export default Index;