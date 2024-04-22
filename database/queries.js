class queries {
    // -- Crime Trends Compared to Real Estate Sales by Month and Borough in 2023

    // -- Subquery for Crimes
    // -- Subquery for Property Sales
    // -- The crime data is joined with the property sales data to compare crime trends with real estate sales by month and borough in 2023.
    // -- This could reveal if higher crime rates in a borough correlate with lower real estate activity or prices.
    // static 
    static crime_trends_query = `SELECT 
    p.sale_month,
    p.BOROUGH,
    c.total_crimes,
    p.average_sale_price
FROM
    (SELECT 
         EXTRACT(MONTH FROM TO_DATE(CRIME_DATE, 'DD/MM/YY')) AS crime_month,
         BOROUGH,
         COUNT(CRIME_ID) AS total_crimes
     FROM 
         AFLORES39.CRIMES
     WHERE 
         EXTRACT(YEAR FROM TO_DATE(CRIME_DATE, 'DD/MM/YY')) = 2023
     GROUP BY 
         EXTRACT(MONTH FROM TO_DATE(CRIME_DATE, 'DD/MM/YY')),
         BOROUGH) c
JOIN
    (SELECT 
         EXTRACT(MONTH FROM TO_DATE(SALE_DATE, 'DD/MM/YY')) AS sale_month,
         BOROUGH,
         AVG(SALE_PRICE) AS average_sale_price
     FROM 
         AFLORES39.PROPERTY_SALES
     WHERE 
         EXTRACT(YEAR FROM TO_DATE(SALE_DATE, 'DD/MM/YY')) = 2023
     GROUP BY 
         EXTRACT(MONTH FROM TO_DATE(SALE_DATE, 'DD/MM/YY')),
         BOROUGH) p
ON 
    c.crime_month = p.sale_month AND
    c.BOROUGH = p.BOROUGH
ORDER BY 
    c.BOROUGH, 
    c.crime_month`;



    // -- Crime Severity Compared to Residential Property Prices by Borough and Month in 2023

    // -- Subquery for Property Sales (ps)
    // -- Subquery for Severe Crimes (cr)
    // -- The property sales data is joined with the severe crime data to compare the number of severe crimes with residential property prices by borough and month in 2023.
    // -- The resulting dataset shows if higher incidents of felony crimes in a borough correlate with lower average residential property prices.
    static crime_severity = `
    SELECT
        ps.sale_month,
        ps.BOROUGH,
        ps.average_residential_price,
        COUNT(cr.CRIME_ID) AS felony_crime_count
    FROM
        (SELECT
             EXTRACT(MONTH FROM TO_DATE(SALE_DATE, 'DD/MM/YY')) AS sale_month,
             BOROUGH,
             AVG(SALE_PRICE) AS average_residential_price
         FROM 
             AFLORES39.PROPERTY_SALES
         WHERE 
             EXTRACT(YEAR FROM TO_DATE(SALE_DATE, 'DD/MM/YY')) = 2023 AND RESIDENTIAL_UNITS > 0
         GROUP BY 
             EXTRACT(MONTH FROM TO_DATE(SALE_DATE, 'DD/MM/YY')),
             BOROUGH) ps
    LEFT JOIN
        (SELECT 
             EXTRACT(MONTH FROM TO_DATE(CRIME_DATE, 'DD/MM/YY')) AS crime_month,
             BOROUGH,
             CRIME_ID
         FROM 
             AFLORES39.CRIMES
         WHERE 
             EXTRACT(YEAR FROM TO_DATE(CRIME_DATE, 'DD/MM/YY')) = 2023 AND
             TYPE_OF_CRIME IN ('FELONY')
         ) cr
    ON 
        ps.sale_month = cr.crime_month AND ps.BOROUGH = cr.BOROUGH
    GROUP BY
        ps.sale_month,
        ps.BOROUGH,
        ps.average_residential_price
    ORDER BY
        ps.BOROUGH,
        ps.sale_month
    `


//     -- Correlation of Rodent Inspection Results with Residential Density by Borough and Month in 2023

// -- Subquery for Rodent Inspections (ri)
// -- Subquery for Property Sales (ps)
// -- The rodent inspection data is joined with the property sales data to correlate the number of failed inspections with residential density.
// -- This could reveal if areas with more densely packed residential units see more rodent control issues.
    static rodent_neighborhood_density = `SELECT
    ri.inspection_month,
    ri.BOROUGH,
    ri.failed_inspections,
    COALESCE(ps.average_residential_units, 0) AS average_residential_units -- Handling NULLs by defaulting to 0
FROM
    (SELECT 
         EXTRACT(MONTH FROM TO_DATE(INSPECTION_DATE, 'DD/MM/YY')) AS inspection_month,
         BOROUGH,
         COUNT(JOB_ID) AS failed_inspections
     FROM 
         AFLORES39.RODENT_INSPECTIONS
     WHERE 
         EXTRACT(YEAR FROM TO_DATE(INSPECTION_DATE, 'DD/MM/YY')) = 2023 AND RESULTS != 'Passed'
     GROUP BY 
         EXTRACT(MONTH FROM TO_DATE(INSPECTION_DATE, 'DD/MM/YY')),
         BOROUGH) ri
LEFT JOIN
    (SELECT 
         EXTRACT(MONTH FROM TO_DATE(SALE_DATE, 'DD/MM/YY')) AS sale_month,
         BOROUGH,
         AVG(RESIDENTIAL_UNITS) AS average_residential_units
     FROM 
         AFLORES39.PROPERTY_SALES
     WHERE 
         EXTRACT(YEAR FROM TO_DATE(SALE_DATE, 'DD/MM/YY')) = 2023 AND RESIDENTIAL_UNITS > 0
     GROUP BY 
         EXTRACT(MONTH FROM TO_DATE(SALE_DATE, 'DD/MM/YY')),
         BOROUGH) ps
ON 
    ri.inspection_month = ps.sale_month AND ri.BOROUGH = ps.BOROUGH
WHERE ri.BOROUGH IS NOT NULL AND ps.BOROUGH IS NOT NULL
ORDER BY 
    ri.BOROUGH,
    ri.inspection_month`



//     -- Theft-related Crimes Compared to Commercial Sales by Borough and Month in 2023

// -- Subquery for Commercial Property Sales (cp)
// -- Subquery for Theft-related Arrests (fa)
// -- The commercial property sales data is joined with the theft-related arrest data to compare theft-related crimes with commercial sales by borough and month in 2023.
// -- This could show if higher commercial activity in a borough correlates with a higher incidence of theft crimes or more law enforcement activity.

    static theft_related_crimes = `SELECT 
    cp.sale_month,
    cp.BOROUGH,
    cp.total_commercial_sales,
    fa.total_theft_arrests
FROM
    (SELECT
         EXTRACT(MONTH FROM TO_DATE(SALE_DATE, 'DD/MM/YY')) AS sale_month,
         BOROUGH,
         COUNT(SALE_ID) AS total_commercial_sales
     FROM 
         AFLORES39.PROPERTY_SALES
     WHERE 
         EXTRACT(YEAR FROM TO_DATE(SALE_DATE, 'DD/MM/YY')) = 2023 AND COMMERCIAL_UNITS > 0
     GROUP BY 
         EXTRACT(MONTH FROM TO_DATE(SALE_DATE, 'DD/MM/YY')),
         BOROUGH) cp
LEFT JOIN
    (SELECT 
         EXTRACT(MONTH FROM TO_DATE(ARREST_DATE, 'DD/MM/YY')) AS arrest_month,
         BOROUGH,
         COUNT(ARREST_ID) AS total_theft_arrests
     FROM 
         AFLORES39.ARRESTS
     WHERE 
         EXTRACT(YEAR FROM TO_DATE(ARREST_DATE, 'DD/MM/YY')) = 2023 AND
         OFFENSE_DESCRIPTION IN ('FRAUDS', 'THEFT-FRAUD', 'PETIT LARCENY', 'GRAND LARCENY', 'ROBBERY', 'OFFENSES INVOLVING FRAUD')
     GROUP BY 
         EXTRACT(MONTH FROM TO_DATE(ARREST_DATE, 'DD/MM/YY')),
         BOROUGH) fa
ON 
    cp.sale_month = fa.arrest_month AND cp.BOROUGH = fa.BOROUGH
ORDER BY 
    cp.BOROUGH,
    cp.sale_month`


//     - Comparison of Violent Crime Reports to Arrests and Population by Borough in 2023

// -- Subquery for Violent Crimes (crimes)
// -- Subquery for Violent Crime Arrests (arrests)
// -- Population Data (loc)
// -- Crimes Per Thousand: This metric shows the number of violent crimes per thousand residents, providing a per capita view of crime rates.
// -- Arrest Efficiency Percentage: This metric represents the percentage of reported crimes that resulted in an arrest, offering insight into law enforcement efficiency.
    static violent_crimes_population = `SELECT 
    crimes.BOROUGH,
    crimes.total_violent_crimes,
    arrests.total_violent_arrests,
    loc.POPULATION_2020,
    (crimes.total_violent_crimes / loc.POPULATION_2020) * 1000 AS crimes_per_thousand,
    (arrests.total_violent_arrests / crimes.total_violent_crimes) * 100 AS arrest_efficiency_percentage
FROM
    (SELECT 
         BOROUGH,
         COUNT(CRIME_ID) AS total_violent_crimes
     FROM 
         AFLORES39.CRIMES
     WHERE 
         EXTRACT(YEAR FROM TO_DATE(CRIME_DATE, 'DD/MM/YY')) = 2023 AND
         CRIME_DESCRIPTION IN ('FELONY ASSAULT', 'ROBBERY')
     GROUP BY 
         BOROUGH) crimes
LEFT JOIN
    (SELECT 
         BOROUGH,
         COUNT(ARREST_ID) AS total_violent_arrests
     FROM 
         AFLORES39.ARRESTS
     WHERE 
         EXTRACT(YEAR FROM TO_DATE(ARREST_DATE, 'DD/MM/YY')) = 2023 AND
         OFFENSE_DESCRIPTION IN ('FELONY ASSAULT', 'ROBBERY')
     GROUP BY 
         BOROUGH) arrests
ON 
    crimes.BOROUGH = arrests.BOROUGH
LEFT JOIN
    AFLORES39.LOCATION loc
ON 
    crimes.BOROUGH = loc.BOROUGH
ORDER BY 
    crimes.BOROUGH`

    complex_queries = [this.crime_trends_query,crime_severity, rodent_neighborhood_density, theft_related_crimes,violent_crimes_population];
}

module.exports = queries;