import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MediaCard from './MediaCard';

configure({ adapter: new Adapter() });

describe('MediaCard', () => {
    it('should render with the content it received as prop', () => {
        const wrapper = shallow(
            <MediaCard
                link="/album/1"
                rounded={false}
                img="https://storage.googleapis.com/gd-wagtail-prod-assets/original_images/evolving_google_identity_share.jpg"
                content="Test"
            />
        );
        expect(wrapper.find('Content').props().children).toEqual('Test');
    });

    it('should show div on mouse enter', () => {
        const wrapper = shallow(
            <MediaCard
                link="/album/1"
                rounded={false}
                img="https://storage.googleapis.com/gd-wagtail-prod-assets/original_images/evolving_google_identity_share.jpg"
                content="Test"
            />
        );
        wrapper.find('CardMedia').simulate('mouseenter');
        expect(wrapper.find('CardHover')).toBeTruthy();
    });

    it('should should check that the div has no children because it does not have the playSong func (after mouse enter)', () => {
        const wrapper = shallow(
            <MediaCard
                link="/album/1"
                rounded={false}
                img="https://storage.googleapis.com/gd-wagtail-prod-assets/original_images/evolving_google_identity_share.jpg"
                content="Test"
            />
        );
        wrapper.find('CardMedia').simulate('mouseenter');
        expect(wrapper.find('CardHover').props().children).toBeFalsy();
    });

    it('should should check that the div goes away after mouse enter and leave', () => {
        const wrapper = shallow(
            <MediaCard
                link="/album/1"
                rounded={false}
                img="https://storage.googleapis.com/gd-wagtail-prod-assets/original_images/evolving_google_identity_share.jpg"
                content="Test"
            />
        );
        wrapper.find('CardMedia').simulate('mouseenter');
        wrapper.find('CardMedia').simulate('mouseleave');
        expect(wrapper.contains('CardHover')).toBeFalsy();
    });

    it('should have inner play button on mouse enter (only appears when receives playSong func as prop)', () => {
        const playSong = jest.fn();
        const wrapper = shallow(
            <MediaCard
                link="/album/1"
                rounded={false}
                img="https://storage.googleapis.com/gd-wagtail-prod-assets/original_images/evolving_google_identity_share.jpg"
                content="Test"
                playSong={playSong}
            />
        );

        wrapper.find('CardMedia').simulate('mouseenter');
        expect(wrapper.find('PlayBtn')).toBeTruthy();
    });

    it('should call playSong func when pressing inner playBtn component (after mouse enter)', () => {
        const playSong = jest.fn();
        const EventPreventDefault = jest.fn();
        const EventStopPropagation = jest.fn();
        const wrapper = shallow(
            <MediaCard
                link="/album/1"
                rounded={false}
                img="https://storage.googleapis.com/gd-wagtail-prod-assets/original_images/evolving_google_identity_share.jpg"
                content="Test"
                playSong={playSong}
            />
        );
        wrapper.find('CardMedia').simulate('mouseenter');
        wrapper.find('PlayBtn').simulate('click', {
            preventDefault: EventPreventDefault,
            stopPropagation: EventStopPropagation
        });
        expect(playSong).toHaveBeenCalled();
    });
});
