import { css } from 'lit';

export default css`
	h1,
	h2,
	h3,
	h4,
	h5,
	h6 {
		margin-top: 0;
		margin-bottom: 0;
		font-weight: bold;
	}

	h1 {
		font-size: 3.2rem;
	}

	h2 {
		font-size: 2.4rem;
	}

	h3 {
		font-size: 2rem;
	}

	.f6 {
		font-size: 1.2rem;
	}

	.f5 {
		font-size: 1.4rem;
	}

	.f4 {
		font-size: 1.6rem;
	}

	.f3 {
		font-size: 1.8rem;
	}

	.f2 {
		font-size: 2rem;
	}

	.f1 {
		font-size: 2.2rem;
	}

	.text-normal {
		font-weight: 400;
	}

	.text-bold {
		font-weight: 600;
	}

	.nowrap {
		white-space: nowrap;
	}

	p {
		font-size: 1.8rem;
		line-height: 1.94;
		max-width: 450px;
		text-align: left;
	}

	@media screen and (max-width: 663px) {
		h1 {
			font-size: 2.8rem;
		}

		h2 {
			font-size: 2rem;
		}

		h3 {
			font-size: 1.4rem;
		}
	}
`;
