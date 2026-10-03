import react from "react";
import image from "../../assets/images/subheader.webp";
import CommonBreadcrumbs from "../../common/CommonBreadcrumbs/CommonBreadcrumbs";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import image3 from "../../assets/images/Satsang App Mantra Mahima.webp";
import "./Founder.css";

const Founder = () => {
  const breadcrumbsData = [
    { label: "Home", url: "/" },
    { label: "About Us", url: "/about-us" },
    <label color="text.primary" className="active-link-color">
      Founder
    </label>,
  ];
  return (
    <>
      <div className="contact-img-wrap">
        <img src={image} alt="" className="about-img" />
        <div className="breadcrumbs-wrap">
          <CommonBreadcrumbs items={breadcrumbsData} separator="›" />
        </div>
      </div>
      <div className="section-padding"></div>
      <Container className="mt-5">
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={12} md={12}>
            <div className="container about-container about-us-content">
              <div>
                <span className="span-bg-color">The Founder</span>
              </div>

              <Container>
                <Grid container spacing={3} justifyContent="center">
                  <Grid item xs={12} sm={12} md={4} lg={3}>
                    <img src={image3} alt="" className="founder-img" />
                  </Grid>
                  <Grid item xs={12} sm={12} md={8} lg={9}>
                    <p className="mt-sm-0 mt-md-5 mt-lg-5">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; The tradition of
                      Gurukul is one of the ancient Indian educational methods.
                      It is said that there were only Gurukuls as places of
                      obtaining knowledge in ancient times for everyone right
                      from child to an adult. “Gurukul is the best place to
                      shape the life of a child.”
                    </p>
                    <p className="mt-4">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Be it a king or
                      beggar, be it a borrower or a lender, be it rich or
                      destitute; all of the people usedto enrol their children’s
                      with the Gurukul, and where according to their competence
                      they used to get educated and get Diksha, and after
                      gettingexamined their knowledge in real life experience
                      which they obtained in Gurukul,they would use them to
                      uplift the lives of everyone.
                    </p>
                  </Grid>
                </Grid>
              </Container>
              <br></br>

              {/* <p>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Be it a king or beggar, be
                it a borrower or a lender, be it rich or destitute; all of the
                people usedto enrol their children’s with the Gurukul, and where
                according to their competence they used to get educated and get
                Diksha, and after gettingexamined their knowledge in real life
                experience which they obtained in Gurukul,they would use them to
                uplift the lives of everyone.
              </p> */}
              {/* <br></br> */}

              <p>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Be it Shri Krishna and
                Sudama, in Ahram of Sandipani, the sage, or be it Upmanyu and
                Aruni in the Ashram of Dhaumya, the sage; their history
                proclaims the importance of Gurukul before us. Once upon a time
                in ancient India, there used to be more than one Lakh Gurukuls.
                Where Children would learn the lessons of devotion toward the
                Lord, the Master (Teacher), the nation, and love towards parents
                and service to the needy. From all of these practical lessons,
                they educate themselves in the real meaning and used to adorn
                their life with these Samskaras.
              </p>
              <br></br>

              <p>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The India, our nation, was
                famous in the entire world as 'Sone Ki Chidiya (a golden
                sparrow). The wealth and prosperity of our nation dazzled
                foreign powers, they tried many times to grab our power and
                wealth, but they never got success; because of the Gurukul
                traditions,the entire nation's human society was united without
                any discrimination of caste and creed, and everyone was coloured
                withthe colour of patriotism, the foreign invaders were firm in
                their belief that it was not only difficult but quite impossible
                to establish a reign in this country until the Gurukul tradition
                is ruined completely. As a result,The foreign tyrants began to
                ruin our dignified Gurukul tradition and they also succeeded
                gradually. After the Gurukul tradition was ruined, the
                patriotism in Indian people began to decrease gradually and the
                root of slavery was deeply cultivated in the people. The
                suffering we are having today is the result of them.
              </p>
              <br></br>

              <p>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;As they say, it is never too
                late to start doing the right thing, in our land, the Gurukul
                tradition has been re-initiated for some lastSeventy-Five years.
                All of us arewell aware, in which direction our children and
                youth are marching towards today. The addictions, false fashions
                and uncontrolled use of mobile phones have become so
                contaminated that one is not able to live faithfully even with
                oneself, the devotion toward nation is quite impossible! Today,
                when we see the spirit of devotion toward God, Master (Guru),
                parents and service to the poor decreasing among our children
                and youth, we can feel the requirement of the present time is to
                transform our children and youth. The same is required in the
                enrichment of Indian cultural ethics and values.
              </p>
              <br></br>

              <p>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; I do offer my humble appeal
                to all Indian gentle and righteous people of our society, if we
                want to have a safe tomorrow, we would have to get the
                characters of our children and youth built firmly from the inner
                sides along with formal education from now. We must have to take
                themahead on the path of Vidya(formal education) toSadda Vidya
                (spiritual knowledge and learning). We must have to make their
                character-building along with the school-college education and
                there is only option we have, and it is Gurukul…!
              </p>
              <br></br>

              <p>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; We have caved a pathway in
                the formation of 'Sanskar Dham Gurukul' with the aim of making
                our children and youth ideal patriots, ideal worshipers of God
                and Master (Guru) and lovers of their parents. We have tried to
                spread the message 'PravartniyaSaddvichar…' of Lord Swami
                Narayan, to all the people; let us all come togetherhere to the
                medium of this pathway for the formation of a bright and shining
                future of India.
              </p>
              <br></br>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Founder;
