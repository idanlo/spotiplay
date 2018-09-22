import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import withSpotifyApi from "./withSpotifyApi";

configure({ adapter: new Adapter() });

describe("withSpotifyApi", () => {
    it("should render", () => {
        const hoc = withSpotifyApi(<h1>hello</h1>);
        const wrapper = shallow(<hoc />);
        console.log(wrapper.debug());
    });
});
