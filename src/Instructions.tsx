export const Instructions = (props: { show?: boolean }) => {
	if (!props.show) return null;

	return (
		<div className='instructions'>
			<h2>Pelin tavoite</h2>
			<p>
				Scromenassa on tarkoitus kerätä mahdollisimman monta pistettä pelaamalla suomenkielisiä sanoja pelilaudalle. Pelaajalla on kädessään seitsemän (7) kirjainlaattaa kerrallaan ja pelaaja nostaa niitä lisää aina kun on pelannut
				uuden sanan laudalle. Peli päättyy, kun kirjainpussissa ei ole enää kirjaimia ja pelaajan käsi on tyhjä tai pelaaja ei saa enää pelattua jäljellä olevia kirjaimia pelilaudalle.
			</p>
			<p>
				Jokaisen uuden sanan on liityttävä jo olemassa olevaan ristikkoon siten, että vähintään yksi uusi pelattu laatta sivuaa vähintään yhtä jo aikaisemmalla vuorolla pelattua laattaa. Ensimmäinen sana tulee pelata siten, että
				jokin sen laatoista on laudan keskellä ja peittää tähden. Laattoja voi pelata vain yhdelle riville tai sarakkeelle saman vuoron aikana. Laattojen väliin ei saa jäädä tyhjiä kohtia.
			</p>
			<h2>Pistelasku</h2>
			<p>Kirjainlaatassa on keskellä kirjain ja oikeassa alakulmassa kirjaimen arvo. Pelatun sanan pistearvo saadaan laskemalla siihen kuuluvien kirjainlaattojen arvot yhteen.</p>
			<p>
				Laudassa on neljänlaisia kertoimia, jotka moninkertaistavat kirjaimesta tai sanasta saatavat pisteet. Kirjainkerroin tuplaa tai triplaa kertoimeen pelatun laatan arvon. Sanakerroin tuplaa tai triplaa sen sanan (tai sanojen)
				arvon, joka muodustuu pelatusta laatasta. Kirjainpisteet lasketaan ennen sanapisteitä. Kerroin käytetään vain sillä vuorolla, jolla sen päälle pelataan laatta.
			</p>
			<h2>Kontrollit</h2>
			<p>Voit liikkua pelilaudalla joko klikkaamalla hiirellä kohtaa johon haluat pelata, tai voit liikkua pelilaudalla nuolinäppäimillä.</p>
			<p>Voit vaihtaa kirjoitussuuntaa painamalla tabia, joka löytyy yleensä näppäimistön vasemmasta reunasta capslockin yläpuolelta.</p>

			<p>Jos haluat poistaa pelatun laatan laudalta, paina backspace-näppäintä, joka löytyy yleensä enterin yläpuolelta.</p>
			<p>
				Voit sovittaa laattoja laudalle ja muuttaa pelattuja laattoja niin kauan, kunnes painat enteriä, jolloin peli tarkistaa, käykö pelattu sana (tai pelatut sanat), laskee vuorolle pisteet ja lukitsee pelatut laatat. Lukittuja
				laattoja ei voi poistaa tai siirtää.
			</p>
		</div>
	);
};
