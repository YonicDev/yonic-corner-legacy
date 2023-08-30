export const BLOG_PAGE_SIZE = 5;
export const CATEGORY_IDS = ["development", "gaming", "creations", "outside", "blog", "misc"] as const;
export const HIDE_DRAFTS_IN_DEVELOPMENT = false;

export type CategoryId = typeof CATEGORY_IDS[number];

export const categories: Record<CategoryId, Category> = {
    development: {
        title: "Dev stuff",
        order: 1,
        description: "In this category, I talk mostly about software design and development, as well as other technology stuff.",
        baseColor: "#156CEA",
        emphasisColor: "#00086D",
    },
    gaming: {
        title: "Gaming",
        order: 2,
        description: "As a game and level designer, videogames are my passion. This category belongs not just to games, but also my findings in their design.",
        baseColor: "#EA153E",
        emphasisColor: "#490500",
    },
    creations: {
        title: "Creative endeavours",
        order: 3,
        description: "Outside videogames, there are other things I'm willing to unleash my creativity. Recently, I've jumped back into illustration, so that is what you'll see here for the most part.",
        baseColor: "#E818B7",
        emphasisColor: "#2B002D",
    },
    outside: {
        title: "Outdoor adventures",
        order: 4,
        description: "\"Go touch some grass!\", they said. But I have better motivators to go outside. While not necessarily an adventure log, this section records my experience in the outside world.",
        baseColor: "#FFC127",
        emphasisColor: "#302700",
    },
    blog: {
        title: "Blog updates",
        order: 5,
        description: "The web is constantly updating, and this blog is no exception. Here you can see the evolution and history of my personal blog.",
        baseColor: "#ED7614",
        emphasisColor: "#2D0B00",
    },
    misc: {
        title: "Miscellaneous",
        order: 6,
        description: "This is where posts that don't belong to the other categories go. I guess you can call them \"uncategorized\", but this is just their place.",
        baseColor: "#32EA85",
        emphasisColor: "#003A1E",
    }
}
