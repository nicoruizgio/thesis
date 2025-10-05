// Removed asset imports because we now use public folder images
// import labourImg from "../assets/article-images/labour_market.jpg";
// import placeholderImg from "../assets/article-images/placeholder.jpg";

const PLACEHOLDER_IMAGE = "/placeholder.jpg"; // put a placeholder.jpg in /public

export const articles = [
  {
    id: "art-001",
    title: "German labour market remains gloomy, economic institute reports",
    headline: null,
    authors: null,
    date: "2025-05-26",
    source: "DPA International",
    section: "Economy",
    url: "https://example.com/articles/energy-transition-accelerates",
    image: "/art-001.png",
    imageAlt: "Labour market indicators in Germany",
    paragraphs: [
      "The outlook for the German labour market may have improved marginally, but it remains gloomy, a leading economic institute said on Monday.",
      "The Institute for Employment Research (IAB), based in the southern city of Nuremberg, said its labour market barometer rose for the second month in a row in May. However, at 98.9 points, the barometer is still below the neutral mark of 100 points.",
      "A value of 90 points would indicate a particularly poor climate, while 110 points would mark a positive development.",
      "The IAB barometer is based on a monthly survey of all local employment agencies regarding their forecasts for the next three months.",
      "The barometer is an early indicator of the future situation on the labour market. The IAB is set to publish its May statistics on Wednesday.",
      "The indicator for forecasting unemployment rose by 0.3 points from the previous month. \"Without a turnaround in economic development, unemployment will continue to rise,\" said IAB labour market expert Enzo Weber.",
      "The employment indicator rose only minimally by 0.1 points to 100.1 points, slightly above the neutral mark for the first time since the beginning of the year. \"The outlook for the labour market is not deteriorating further, but there is no sign of a breakthrough,\" Weber said.",
      "Meanwhile, the Munich-based ifo Institute sees initial signs of stabilization. Its employment barometer rose to 95.2 points in May, from 94 points in April.",
      "\"Whether this will turn into a real trend reversal depends largely on further economic developments,\" ifo expert Klaus Wohlrabe emphasized."
    ],
    get text() { return this.paragraphs.join("\n\n"); }
  },
  {
    id: "art-002",
    title: "German opposition slams government's budget plans",
    headline: null,
    authors: "Magdalena Henkel",
    date: "2025-09-16",
    source: "DPA International Service in English",
    section: "Politics",
    url: "https://example.com/articles/german-budget-plans",
    image: "/art-002.png",
    imageAlt: "German parliament debating budget plans",
    paragraphs: [
      "Berlin (dpa) - Members of Germany's opposition on Tuesday ripped into the government's plans for the 2025 budget, which are set to be at the heart of parliamentary debate this week.",
      "Lawmakers are to vote on this year's budget in the coming days, after failure to agree on how to plug a multibillion-euro hole brought down the previous administration of Chancellor Olaf Scholz in November last year.",
      "Subsequent early elections in February meant this year's budget had to wait until a new government was in place, with Chancellor Friedrich Merz's conservative-led alliance taking the helm in May.",
      "Thanks to the delay, the 2025 budget is only set to be in effect for three months if lawmakers approve the plans at the end of the week - which has made it comparatively easy for Finance Minister Lars Klingbeil to come up with a draft.",
      "Regardless, opposition lawmakers accused the government of relying too heavily on borrowing after the coalition moved to exempt spending on defence and infrastructure from the country's strict debt rules.",
      "According to Michael Espendiller, chief budgetary officer for the far-right Alternative for Germany (AfD), the government is \"unabashedly pursuing the most extreme level of debt this country has ever seen.\"",
      "His party, the biggest opposition force, advocates complying with Germany's debt rules known as the debt brake, and has proposed cutting funding for climate measures, EU contributions and arms deliveries to Ukraine instead.",
      "Ines Schwerdtner from The Left party, meanwhile, said the money was not reaching those needing it the most.",
      "\"Never before has a government spent so much money, and never before has so little reached the people,\" the far-left party leader said.",
      "Government spending is set to total €502.55 billion ($593.9 billion) this year, according to the draft budget, slightly up on last year.",
      "This includes core debt of almost €82 billion, alongside additional borrowing for investment in infrastructure and defence, which is likely to bring total government debt up to over €140 billion.",
      "Despite the criticism, the real trouble awaits when agreement has to be made on the budgets for the coming years, with lawmakers set to debate the 2026 budget in the coming weeks.",
      "For 2027, the German government needs to find a way to plug a €34-billion hole."
    ],
    get text() { return this.paragraphs.join("\n\n"); }
  },
  {
    id: "art-003",
    title: "Germany's army needs to more than double in size, commander says",
    headline: "100,000 more active troops needed to meet NATO targets",
    authors: "Sabine Siebold",
    date: "2025-09-11",
    source: "Reuters News",
    section: "Defense",
    url: "https://example.com/articles/german-army-expansion",
    image: "/art-004.png",          // served from public/
    imageAlt: "German soldiers during military exercises",
    paragraphs: [
      "BERLIN, Sept 11 (Reuters) - Germany's army needs to add 100,000 active troops to its existing 62,000 to meet new NATO targets intended to boost preparedness for the growing threat of Russian aggression, its commander says in a confidential paper seen by Reuters on Thursday.",
      "\"It is imperative for the army to become sufficiently ready for war by 2029 and provide the capabilities Germany pledged (to NATO) by 2035,\" Army Chief Alfons Mais wrote in a letter dated September 2, addressed to the chief of the defence staff, Carsten Breuer. He said achieving these objectives was impossible with currently approved personnel levels, which also include 37,000 non-active troops.",
      "Germany has already begun increasing its commitments to allies in eastern Europe, not least with the establishment of a German brigade in Lithuania, set to number some 5,000 troops, and a naval patrol deployment in the Baltic to counter undersea sabotage.",
      "Mais called for an increase of roughly 45,000 active troops by 2029 - the year the U.S.-led alliance has said it expects Russia to be capable of a large-scale attack on Western allies.",
      "Moscow has consistently denied any intention to wage war against NATO or its members.",
      "Additionally, to meet NATO targets agreed at a summit in June and build reserves for a war of attrition of the kind Russia is waging in Ukraine, Mais projected a requirement for another 45,000 active troops by 2035.",
      "He also called for some 10,000 extra troops to bolster territorial defence.",
      "A spokesperson for the Defence Ministry in Berlin declined to comment on the document, citing its confidential nature.",
      "He said NATO had adjusted its capability targets in response to the significantly heightened threats following Russia's full-scale invasion of Ukraine in 2022: \"According to a first rough estimate, a total of around 460,000 personnel (from Germany) will be necessary, divided into some 260,000 active troops and around 200,000 reservists.\"",
      "In June, Defence Minister Boris Pistorius announced that Germany would need up to 60,000 additional active personnel across all military branches to meet the new NATO targets, bringing the future strength of Germany's armed forces, the Bundeswehr, to around 260,000.",
      "However, they have yet to achieve a goal of 203,000 troops set in 2018, and remain understaffed by approximately 20,000 regular personnel, according to ministry figures."
    ],
    get text() { return this.paragraphs.join("\n\n"); }
  },
  {
    id: "art-004",
    title: "German home prices set for steady recovery over next two years, affordability to worsen",
    headline: "Home prices to rise 3% in 2025 after two-year decline, Reuters poll shows",
    authors: "Indradip Ghosh",
    date: "2025-09-16",
    source: "Reuters News",
    section: "Economy",
    url: "https://example.com/articles/german-home-prices-recovery",
    image: "/art-005.png",          // served from public/
    imageAlt: "Residential buildings in a German city, symbolizing the housing market",
    paragraphs: [
      "German home prices will rise 3% in 2025, after a two-year decline, and grow slightly faster through 2027, according to a Reuters poll of property experts who said affordability would worsen.",
      "The real estate sector in Europe's biggest economy is gradually emerging from its deepest slump in decades, recent data showed, cushioned by the European Central Bank's cumulative 200 basis points of interest rate cuts.",
      "Home prices increased 3.8% year-on-year in the first quarter, the fastest quarterly growth since 2022, while home building permits - an indicator of future construction activity - surged 7.9% in June from a year earlier.",
      "However, broader subdued economic conditions pose risks to a sustained housing market recovery. Germany's economy contracted last quarter, dimming expectations of a prolonged recovery.",
      "Home prices will increase 3.0% in 2025, their first lift in three years, and 3.5% in 2026, the September 3-15 Reuters poll of 14 property analysts found. They fell 8.4% in 2023 and 1.5% last year.",
      "\"The recovery in the housing market continues, despite stagnating affordability of purchasing residential real estate, and we do not see any indications of a reversal of this trend. However, the high level of uncertainty, both economically and geopolitically... is likely to continue to weigh on consumer confidence,\" said Carsten Brzeski, global head of macro at ING.",
      "Eleven of the 14 analysts said affordability for first-time home buyers would worsen over the coming year, despite the ECB being expected to hold rates for a long period.",
      "\"A further substantial improvement in affordability is not foreseeable for the remainder of 2025 and the coming year,\" said Sebastian Wunsch, head of property economic analyses at GEWOS, an independent consulting and research institute.",
      "\"Given the continued very low number of building permits for rental housing construction... the market situation is unlikely to change fundamentally in the foreseeable future,\" Wunsch said.",
      "Average urban home rents will increase 3%-5% over the coming year, according to the poll's median view, despite government plans to extend rent controls."
    ],
    get text() { return this.paragraphs.join("\n\n"); }
  },
  {
    id: "art-005",
    title: "Local election to test Merz coalition",
    headline: "North Rhine-Westphalia vote seen as first major test for Friedrich Merz's government",
    authors: null,
    date: "2025-09-13",
    source: "DW English",
    section: "Politics",
    url: "https://example.com/articles/nrw-election-merz-coalition",
    image: "/art-006.png", // served from public/
    imageAlt: "Campaign posters and people voting in North Rhine-Westphalia local elections",
    paragraphs: [
      "Political parties will be holding final campaigns ahead of a local election in North Rhine-Westphalia. The poll is being seen locally as the first test of Friedrich Merz's coalition government.",
      "Last day of campaigning ahead of Sunday's local election in North-Rhine Westphalia.",
      "The vote is being seen as the first test of Merz's coalition in Germany's most populous state.",
      "Many Germans are battling to make ends meet and are borrowing money to cover basic expenses, according to a survey commissioned by Barclays bank.",
      "Over half of adults under 50 borrowed money during the course of the past two years, the poll by research institute Civey said.",
      "Forty-four percent of respondents relied on family members, while 40% took bank loans.",
      "Borrowed funds were mainly used for daily necessities such as food (26.6%) and general consumption, including clothing (21.4%). About 18% borrowed to treat themselves.",
      "The poll questioned 10,007 adults across Germany in July and August.",
      "Political parties in the German state of North Rhine-Westphalia (NRW) took advantage of the last day of campaigning for local elections.",
      "The state is the country's most populous and is home to 18 million residents living in urban hubs such as Cologne, Düsseldorf and Dortmund, as well as the state's rural areas.",
      "Sunday will see city and municipal councils, county councils, mayors and district administrators voted in — about 20,000 seats in total.",
      "The vote is being seen as the first test of Chancellor Friedrich Merz's coalition, which includes the conservative Christian Democratic Union (CDU), Bavarian sister party the Christian Social Union (CSU), and the center-left Social Democrats (SPD).",
      "It's also a major test for state Premier Hendrik Wüst and his state government.",
      "Wüst (CDU) has been governing with the Green Party since 2022 and has been tipped as a possible successor to Merz.",
      "Opinion polls are predicting gains in some parts for the far-right AfD in places like Gelsenkirchen and Duisburg in the Ruhr area."
    ],
    get text() { return this.paragraphs.join("\n\n"); }
  }
  ,





];

export function getArticleById(id) {
  const art = articles.find(a => a.id === id) || null;
  if (art && !art.image) {
    art.image = PLACEHOLDER_IMAGE;
    art.imageAlt = art.imageAlt || art.title;
  }
  return art;
}