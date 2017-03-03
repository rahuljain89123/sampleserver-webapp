
import React from 'react'
import { connect } from 'react-redux'

import { Button } from '../basecoat/Button'


class Homepage extends React.Component {
    render () {
        return (
            <div className="homepage">
                <div className="jumbotron">
                    <div className="container">
                      <h1>Industry-leading Environmental Software for Laboratories</h1>
                    </div>
                </div>

                <section className="intro">
                    <div className="container">
                        <h2>White-Labeled Laboratory Portal and App</h2>
                        <p>Sampleserve is a platform as a service for Environmental Laboratories. The platform streamlines bottle requests, sample collection, chain of custody, and data delivery through techology. We also provide a new revenue channel so Labs can make money on the data they already have, without extra effort.</p>
                        <p>Sampleserve offers a white-labeled portal and mobile app for laboratories to manage their clients. The portal and mobile app can be customized with a logo and colors to make the app unique to you and your brand. The portal and app become a unique extension to your business without any distruption to your customers. </p>
                    </div>
                </section>

                <section className="benefits">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4">
                                <h3>Earn additional Revenue</h3>
                                <p>Sampleserve enables you to add-on reports that clients already need, and we split the revenue with you.</p>
                            </div>
                            <div className="col-md-4">
                                <h3>Differentiate Your Lab</h3>
                                <p>Get repeat business from clients by offering more than a spreadsheet.</p>
                            </div>
                            <div className="col-md-4">
                                <h3>Eliminate Painful Data Entry</h3>
                                <p>Save countless hours of error prone data entry with our patented digital workflow.</p>
                            </div>

                        </div>
                    </div>
                </section>

                <section className="panel centered">
                    <div className="container">
                        <h3>Are you interested?</h3>
                        <p><a href="mailto:schindler@sampleserve.com">Contact us for more info</a>.</p>
                    </div>
                </section>

                <section className="partners">
                    <div className="container">
                        <div className="row lab-logos">
                            <div className="col-md-4">
                                <a href="http://www.bio-chem.com/index.html"><img className="biochem" src="/static/img/labs/biochem.gif" alt="" /></a>
                            </div>
                            <div className="col-md-4">
                                <a href="https://www.esclabsciences.com/"><img className="esc" src="/static/img/labs/esc-labs.svg" alt="" /></a>
                            </div>
                            <div className="col-md-4">
                                <a href="http://rtilab.com/"><img className="rti" src="/static/img/labs/rti.png" alt="" /></a>
                            </div>
                            <div className="col-md-4">
                                <a href="http://www.sosanalytical.com/"><img className="sos" src="/static/img/labs/sos.gif" alt="" /></a>
                            </div>
                            <div className="col-md-4">
                                <a href="https://www.pacelabs.com/index.html"><img className="pace" src="/static/img/labs/pace-analytical.jpg" alt="" /></a>
                            </div>
                            <div className="col-md-4">
                                <a href="https://www.alsglobal.com/us"><img className="als" src="/static/img/labs/als.png" alt="ALS Labs" /></a>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="workflow">
                    <div className="container">
                        <h2>Patented Digital Workflow</h2>
                        <ul>
                            <li>Our patented Digital Chain of Custody eliminates the tedious data-entry and is safer than handwritten forms.</li>
                            <li>Sampleserve integration with your current LIMS system integration to make checking in samples as easy as scanning a barcode. </li>
                            <li>Secure Digital Delivery of data directly to clients, with upsells built in.</li>
                            <li>Manage bottle requests, create work scopes, generate barcoded sample labels, and much more.</li>
                        </ul>
                    </div>
                </section>
                <section className="testimonials">
                    <div className="container">
                        <h2>Testimonials</h2>
                        <p>"Get some testimonials praising the product"
                            <br/>
                            -John Oilslicks, Pace Analytical
                        </p>
                    </div>
                </section>
                <section className="premium-reports">
                    <div className="container">
                        <h2>Premium Reports</h2>
                        <ul>
                            <li>Site History</li>
                            <li>Field Data Results Table</li>
                            <li>Field Data Results Graph</li>
                            <li>Groundwater Elevation Graph</li>
                            <li>Analytical Results Map(s)</li>
                            <li>Analytical Results Table (ND)</li>
                            <li>Analytical Results Table ({"<"})</li>
                            <li>Analytical Results Graph</li>
                            <li>Analytical Results/Groundwater Elevation Graph</li>
                            <li>Groundwater Elevation Map</li>
                            <li>Free Product Thickness Map</li>
                            <li>Free Product/Groundwater Elevation Graph</li>
                            <li>Well Construction/Location</li>
                        </ul>
                        <div className="row reports-images">
                            <div className="col-md-4">
                                <img src="/static/img/ground-leak-slide.jpg" alt="" />
                            </div>
                            <div className="col-md-4">
                                <img src="/static/img/Screenshot_2017-02-10_01.27.36.png" alt="" />
                            </div>
                            <div className="col-md-4">
                                <img src="/static/img/Screenshot_2017-02-10_01.17.25.png" alt="" />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="cta-bottom">
                    <div className="container">
                        <p>Sampleserve software changes the dynamic between your lab and your clients. Laboratory services become less of a “per unit” commodity and are valued more on a total package deliverable basis. Consulting engineering companies conversely become more of a commodity, because a significant portion of the services they used to provide on a time and materials basis (i.e. info-graphics generation and reporting) have now become automated and can be done quicker and more effectively with our intuitive software. The end result? </p>
                        <strong><p>You make more money on your data and your clients get the reports they need for a fraction of what they're already paying.</p></strong>
                    </div>
                </section>
                <section className="panel centered">
                    <div className="container">
                        <h3>Are you interested?</h3>
                        <p><a href="mailto:schindler@sampleserve.com">Contact us for more info</a>.</p>
                    </div>
                </section>
            </div>
        )
    }
}

export default Homepage
