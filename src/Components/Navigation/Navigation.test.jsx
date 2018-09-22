import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { BrowserRouter } from "react-router-dom";
import renderer from "react-test-renderer";
import { Navigation } from "./Navigation";

configure({ adapter: new Adapter() });

describe("Navigation", () => {
    it("should render two navigation links in a list", () => {
        const wrapper = renderer
            .create(
                <BrowserRouter>
                    <Navigation
                        items={[
                            { text: "test1", link: "test1" },
                            { text: "test2", link: "test2" }
                        ]}
                    />
                </BrowserRouter>
            )
            .toJSON();
        expect(wrapper).toMatchSnapshot();
    });

    it("should render the text it was given as prop", () => {
        const wrapper = shallow(
            <Navigation items={[{ text: "test1", link: "test1" }]} />
        );
        expect(wrapper.find("StyledLink").props().children).toEqual("test1");
    });

    it("should link the user to the route it received from props", () => {
        const wrapper = shallow(
            <Navigation items={[{ text: "test", link: "/test" }]} />
        );
        expect(wrapper.find("StyledLink").props().to).toEqual("/test");
    });
});
