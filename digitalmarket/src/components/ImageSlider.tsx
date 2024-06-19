"use client";

// ------------------------------------------------------------
// ------------------------------------------------------------

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
// helps us to go left and right in pagination model
import "swiper/css/pagination";
import type SwiperType from "swiper";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Pagination } from "swiper/modules";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ------------------------------------------------------------
// ------------------------------------------------------------

interface ImageSliderProps {
  urls: string[];
}

// ------------------------------------------------------------
// ------------------------------------------------------------

const ImageSlider = ({ urls }: ImageSliderProps) => {
  const [swiper, setSwiper] = useState<null | SwiperType>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideConfig, setSlideConfig] = useState({
    isBeginning: true,
    isEnd: activeIndex === (urls.length ?? 0) - 1,
  });

  // ------------------------------------------------------------

  // when we are at the beginning and when we are at the end
  useEffect(
    () => {
      // when every we have event of slideChnage then we gonna update slideConfig based on it
      swiper?.on("slideChange", ({ activeIndex }) => {
        // we gonna set reactive value of the state that we kee^p track of
        setActiveIndex(activeIndex);
        // keep track where we current are
        setSlideConfig({
          // when we are the in first image of product
          isBeginning: activeIndex === 0,
          // end of the array if it is null or undefined it will be 0 otherwise is going to use the url length value minus 1
          isEnd: activeIndex === (urls.length ?? 0) - 1,
        });
      });
    },
    // when it is gonna rerun well on all the outside values that we use in here
    [swiper, urls]
  );

  // ------------------------------------------------------------

  const activeStyles =
    "active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full border-2 bg-white border-zinc-300";

  const inactiveStyles = "hidden text-gray-400";

  // ------------------------------------------------------------

  return (
    <div className="group relative bg-zinc-100 aspect-square overflow-hidden rounded-xl">
      <div className="absolute z-10 inset-0 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={(e) => {
            e.preventDefault();
            // so this is just a function we can call on the swiper to slide to the next slide
            swiper?.slideNext();
          }}
          className={cn(activeStyles, "right-3 transition", {
            // when we are gonna apply this style when it is at the end
            [inactiveStyles]: slideConfig.isEnd,
            // when we are not at the end
            "hover:bg-primary-300 text-primary-800 opacity-100":
              !slideConfig.isEnd,
          })}
          // beacsue it is only just icone so for screen reader and accessibility best practices we gonna include this. people with visuial problem know what this is
          aria-label="next image"
        >
          {/* icon from lucide react */}
          <ChevronRight className="h-4 w-4 text-zinc-700" />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            swiper?.slidePrev();
          }}
          className={cn(activeStyles, "left-3 transition", {
            [inactiveStyles]: slideConfig.isBeginning,
            "hover:bg-primary-300 text-primary-800 opacity-100":
              !slideConfig.isBeginning,
          })}
          aria-label="previous image"
        >
          <ChevronLeft className="h-4 w-4 text-zinc-700" />
        </button>
      </div>

      <Swiper
        pagination={{
          // customize the icon that is render for the pagination this is an object that gets a render bullet function where 1st parametr we dont care so _ and jwe just care about className. and what we return from this is just pagination icons
          renderBullet: (_, className) => {
            // no className just class becasue it is direct just html
            return `<span class="rounded-full transition ${className}"></span>`;
          },
        }}
        onSwiper={(swiper) => setSwiper(swiper)}
        spaceBetween={50}
        modules={[Pagination]}
        slidesPerView={1}
        className="h-full w-full"
      >
        {urls.map((url, i) => (
          <SwiperSlide key={i} className="-z-10 relative h-full w-full">
            <Image
              fill
              loading="eager"
              className="-z-10 h-full w-full object-cover object-center"
              src={url}
              alt="Product image"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// ------------------------------------------------------------
// ------------------------------------------------------------

export default ImageSlider;
