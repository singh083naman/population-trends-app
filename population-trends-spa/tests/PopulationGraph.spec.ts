import { mount } from "@vue/test-utils";
import PopulationGraph from "@/components/PopulationGraph.vue";
import { getPrefectures, getPopulationComposition } from "@/services/resasApi";

// Mocking the API calls
jest.mock("@/services/resasApi", () => ({
  getPrefectures: jest.fn(),
  getPopulationComposition: jest.fn(),
}));

describe("PopulationGraph.vue", () => {
  const prefecturesMock = [
    { prefCode: 1, prefName: "Hokkaido" },
    { prefCode: 2, prefName: "Aomori" },
  ];

  const populationDataMock = [
    { year: 2020, value: 5000 },
    { year: 2021, value: 5100 },
  ];

  beforeEach(() => {
    (getPrefectures as jest.Mock).mockResolvedValue(prefecturesMock);
    (getPopulationComposition as jest.Mock).mockResolvedValue(
      populationDataMock
    );
  });

  it("renders loading state initially", () => {
    const wrapper = mount(PopulationGraph, {
      props: { selectedPrefectures: [] },
    });
    expect(wrapper.find(".loading-indicator").exists()).toBe(true);
  });

  it("fetches population data and updates the chart when selectedPrefectures changes", async () => {
    const wrapper = mount(PopulationGraph, {
      props: { selectedPrefectures: [1] },
    });

    await wrapper.vm.$nextTick(); // Wait for the component to fetch data
    expect(getPrefectures).toHaveBeenCalled();
    expect(getPopulationComposition).toHaveBeenCalledWith(1);

    // Update the selected prefectures and trigger reactivity
    await wrapper.setProps({ selectedPrefectures: [1, 2] });
    expect(getPopulationComposition).toHaveBeenCalledTimes(3); // Called for both prefectures
  });
});
