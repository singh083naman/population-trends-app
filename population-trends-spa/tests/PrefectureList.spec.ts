import { mount } from "@vue/test-utils";
import PrefectureList from "@/components/PrefectureList.vue";
import { getPrefectures } from "@/services/resasApi";

jest.mock("@/services/resasApi"); // Mock the API calls

describe("PrefectureList.vue", () => {
  let wrapper: any;

  beforeEach(() => {
    (getPrefectures as jest.Mock).mockResolvedValue([
      { prefCode: 1, prefName: "Tokyo" },
      { prefCode: 2, prefName: "Osaka" },
    ]);

    wrapper = mount(PrefectureList);
  });

  it("renders prefectures correctly", async () => {
    await wrapper.vm.$nextTick(); // Wait for the fetch to complete
    expect(wrapper.findAll(".prefecture-item")).toHaveLength(2);
    expect(wrapper.find(".prefecture-item").text()).toContain("Tokyo");
    expect(wrapper.findAll(".prefecture-item")[1].text()).toContain("Osaka");
  });

  it("emits prefectureSelected with correct code when checkbox is toggled", async () => {
    const checkbox = wrapper.find('input[type="checkbox"][value="1"]');
    await checkbox.setValue(true); // Simulate checking the checkbox

    // Check that the emitted event contains the correct prefCode
    expect(wrapper.emitted("prefectureSelected")).toBeTruthy();
    expect(wrapper.emitted("prefectureSelected")![0]).toEqual([1]);

    await checkbox.setValue(false); // Simulate unchecking the checkbox
    expect(wrapper.emitted("prefectureSelected")).toHaveLength(2); // It should emit twice now
    expect(wrapper.emitted("prefectureSelected")![1]).toEqual([1]);
  });
});
